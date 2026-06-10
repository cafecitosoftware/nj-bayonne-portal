#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const indexPath = path.join(rootDir, 'public', 'data', 'events', 'index.json')

async function downloadFile(url, filePath) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url)
        const protocol = parsedUrl.protocol === 'https:' ? https : http

        const request = protocol.get(url, { timeout: 10000 }, response => {
            // Handle redirects
            if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 303 || response.statusCode === 307 || response.statusCode === 308) {
                downloadFile(response.headers.location, filePath).then(resolve).catch(reject)
                return
            }

            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${response.statusCode} ${response.statusMessage}`))
                return
            }

            const fileStream = fs.createWriteStream(filePath)
            response.pipe(fileStream)

            fileStream.on('finish', () => {
                fileStream.close()
                console.log(`✓ Downloaded: ${path.relative(rootDir, filePath)}`)
                resolve()
            })

            fileStream.on('error', err => {
                fs.unlink(filePath, () => {})
                reject(err)
            })
        })

        request.on('error', reject)
        request.on('timeout', () => {
            request.destroy()
            reject(new Error(`Timeout downloading ${url}`))
        })
    })
}

async function processEvents() {
    try {
        // Read the index file
        const indexContent = fs.readFileSync(indexPath, 'utf-8')
        const indexData = JSON.parse(indexContent)

        const sources = indexData.sources || []

        // Filter sources that have a URL to download
        const sourcesToDownload = sources.filter(source => source.url && source.enabled)

        if (sourcesToDownload.length === 0) {
            console.log('No remote event sources to download.')
            return
        }

        console.log(`Downloading ${sourcesToDownload.length} event source(s)...`)

        // Download each source
        for (const source of sourcesToDownload) {
            try {
                const filePath = path.join(rootDir, 'public', source.endpoint.replace(/^\//, ''))

                // Create directory if it doesn't exist
                const dirPath = path.dirname(filePath)
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true })
                }

                console.log(`Downloading: ${source.name} from ${source.url}`)
                await downloadFile(source.url, filePath)
            } catch (error) {
                console.error(`✗ Error downloading ${source.name}:`, error.message)
                // Don't exit on error, continue with other sources
            }
        }

        console.log('Event download complete.')
    } catch (error) {
        console.error('Error processing events:', error.message)
        process.exit(1)
    }
}

// Run the process
processEvents().catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
})
