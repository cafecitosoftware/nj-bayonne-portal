#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const indexPath = path.join(rootDir, 'public', 'data', 'events', 'index.json')

function normalizeIcsContent(content) {
    // Ensure no BOM and normalize line endings to CRLF (RFC5545 friendly).
    const withoutBom = content.replace(/^\uFEFF/, '')
    const normalizedNewlines = withoutBom.replace(/\r\n|\r|\n/g, '\n')
    return normalizedNewlines.replace(/\n/g, '\r\n')
}

function formatQueryDate(date, format = 'MM/DD/YYYY hh:mm a') {
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const year = String(date.getFullYear())

    const hours24 = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const period = hours24 >= 12 ? 'pm' : 'am'
    const hours12 = String((hours24 % 12) || 12).padStart(2, '0')

    if (format === 'iso') {
        return date.toISOString()
    }

    // Supports the requested style: MM/DD/YYYY hh:mm a
    return format
        .replace('MM', month)
        .replace('DD', day)
        .replace('YYYY', year)
        .replace('hh', hours12)
        .replace('mm', minutes)
        .replace('a', period)
}

function buildApiUrl(source) {
    const url = new URL(source.url)
    const queryParams = source.queryParams
    const queryParamsFormat = source.queryParamaFormat || source.queryParamsFormat || 'MM/DD/YYYY hh:mm a'
    const queryAhead = source.queryAhead ?? source.queryDateRange ?? 'currentYear'
    const configuredMonthsAhead = Number(source.queryMonthsAhead)
    const monthsAhead = Number.isFinite(configuredMonthsAhead) && configuredMonthsAhead >= 0
        ? configuredMonthsAhead
        : 6

    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date(startDate)
    if (queryAhead === 'monthsAhead') {
        endDate.setMonth(endDate.getMonth() + monthsAhead)
    } else if (typeof queryAhead === 'number' && Number.isFinite(queryAhead) && queryAhead >= 0) {
        endDate.setMonth(endDate.getMonth() + queryAhead)
    } else {
        endDate.setFullYear(startDate.getFullYear(), 11, 31)
        endDate.setHours(0, 0, 0, 0)
    }

    if (Array.isArray(queryParams)) {
        const [startKey, endKey] = queryParams
        if (startKey) {
            url.searchParams.set(startKey, formatQueryDate(startDate, queryParamsFormat))
        }
        if (endKey) {
            url.searchParams.set(endKey, formatQueryDate(endDate, queryParamsFormat))
        }
        return url.toString()
    }

    if (queryParams && typeof queryParams === 'object') {
        if (queryParams.start) {
            url.searchParams.set(queryParams.start, formatQueryDate(startDate, queryParamsFormat))
        }
        if (queryParams.end) {
            url.searchParams.set(queryParams.end, formatQueryDate(endDate, queryParamsFormat))
        }
    }

    return url.toString()
}

function toStringOrNull(value) {
    if (value === null || value === undefined) return null
    const text = String(value).trim()
    return text || null
}

function firstDefined(...values) {
    for (const value of values) {
        const normalized = toStringOrNull(value)
        if (normalized) return normalized
    }
    return null
}

function parseDateTimeValue(value) {
    const text = toStringOrNull(value)
    if (!text) return {}

    // Keep wall-clock values for naive ISO strings (no timezone offset suffix).
    const naiveIsoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?$/)
    if (naiveIsoMatch) {
        const [, year, month, day, hour, minute] = naiveIsoMatch
        return {
            date: `${year}-${month}-${day}`,
            time: hour && minute ? `${hour}:${minute}` : undefined,
            allDay: !(hour && minute),
        }
    }

    // Handles ISO dates and date-times (including timezone offsets).
    const parsed = new Date(text)
    if (!Number.isNaN(parsed.getTime())) {
        const iso = parsed.toISOString()
        return {
            date: iso.slice(0, 10),
            time: iso.slice(11, 16),
            allDay: !/[T\s]\d{1,2}:\d{2}/.test(text),
        }
    }

    // Handles YYYY-MM-DD and YYYY-MM-DD HH:mm:ss style values.
    const match = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::\d{2})?)?$/)
    if (!match) return {}

    const [, year, month, day, hour, minute] = match
    return {
        date: `${year}-${month}-${day}`,
        time: hour && minute ? `${hour}:${minute}` : undefined,
        allDay: !(hour && minute),
    }
}

function inferTimezone(startRaw, endRaw, sourceTimezone) {
    const fromSource = toStringOrNull(sourceTimezone)
    if (fromSource) return fromSource

    const combined = `${toStringOrNull(startRaw) || ''} ${toStringOrNull(endRaw) || ''}`
    if (/Z\b/.test(combined)) return 'UTC'

    const offsetMatch = combined.match(/([+-]\d{2}:?\d{2})\b/)
    if (offsetMatch) {
        return `UTC${offsetMatch[1]}`
    }

    return null
}

function normalizeApiEvent(rawEvent = {}, index = 0, source = {}) {
    const title = firstDefined(
        rawEvent.title,
        rawEvent.name,
        rawEvent.summary,
        rawEvent.subject,
        rawEvent.eventName
    )

    const startRaw = firstDefined(
        rawEvent.start,
        rawEvent.startDate,
        rawEvent.start_date,
        rawEvent.date,
        rawEvent.eventDate,
        rawEvent.when
    )

    const endRaw = firstDefined(
        rawEvent.end,
        rawEvent.endDate,
        rawEvent.end_date,
        rawEvent.endTime,
        rawEvent.endsAt
    )

    const start = parseDateTimeValue(startRaw)
    const end = parseDateTimeValue(endRaw)

    if (!title || !start.date) {
        return null
    }

    const timezone = inferTimezone(startRaw, endRaw, source.timezone)
    const explicitAllDay = typeof rawEvent.allDay === 'boolean' ? rawEvent.allDay : undefined
    const allDay = explicitAllDay ?? (start.allDay ?? (!start.time && !end.time))

    return {
        id: firstDefined(rawEvent.id, rawEvent.uid) || `${title}-${start.date}-${index + 1}`,
        title,
        date: start.date,
        time: allDay ? undefined : start.time,
        endDate: end.date,
        endTime: allDay ? undefined : end.time,
        allDay,
        url: firstDefined(rawEvent.url, rawEvent.link, rawEvent.eventUrl),
        location: firstDefined(rawEvent.location, rawEvent.venue, rawEvent.address),
        description: firstDefined(rawEvent.description, rawEvent.details, rawEvent.body),
        timezone,
    }
}

    function normalizeApiPayload(payload, source = {}) {
    const rawEvents = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.events)
            ? payload.events
            : Array.isArray(payload?.data)
                ? payload.data
                : Array.isArray(payload?.items)
                    ? payload.items
                    : []

    const events = rawEvents
        .map((event, index) => normalizeApiEvent(event, index, source))
        .filter(Boolean)

    return { events }
}

async function fetchRemoteText(url) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url)
        const protocol = parsedUrl.protocol === 'https:' ? https : http

        const request = protocol.get(url, { timeout: 10000 }, response => {
            // Handle redirects
            if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 303 || response.statusCode === 307 || response.statusCode === 308) {
                fetchRemoteText(response.headers.location).then(resolve).catch(reject)
                return
            }

            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${response.statusCode} ${response.statusMessage}`))
                return
            }

            const chunks = []
            response.on('data', chunk => chunks.push(chunk))
            response.on('end', () => {
                try {
                    const rawContent = Buffer.concat(chunks).toString('utf8')
                    resolve(rawContent)
                } catch (writeErr) {
                    reject(writeErr)
                }
            })

            response.on('error', err => {
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

async function downloadIcalFile(url, filePath) {
    const rawContent = await fetchRemoteText(url)
    const normalizedContent = normalizeIcsContent(rawContent)
    fs.writeFileSync(filePath, normalizedContent, 'utf8')
    console.log(`✓ Downloaded: ${path.relative(rootDir, filePath)}`)
}

async function downloadJsonFile(url, filePath, transform = payload => payload, source = {}) {
    const rawContent = await fetchRemoteText(url)
    const parsedContent = JSON.parse(rawContent)
    const transformed = transform(parsedContent, source)
    fs.writeFileSync(filePath, `${JSON.stringify(transformed, null, 2)}\n`, 'utf8')
    console.log(`✓ Downloaded: ${path.relative(rootDir, filePath)}`)
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
                const sourceUrl = source.type === 'api' ? buildApiUrl(source) : source.url

                // Create directory if it doesn't exist
                const dirPath = path.dirname(filePath)
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true })
                }

                console.log(`Downloading: ${source.name} from ${sourceUrl}`)
                if (source.type === 'ical') {
                    await downloadIcalFile(sourceUrl, filePath)
                } else if (source.type === 'api') {
                    await downloadJsonFile(sourceUrl, filePath, normalizeApiPayload, source)
                } else {
                    await downloadJsonFile(sourceUrl, filePath)
                }
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
