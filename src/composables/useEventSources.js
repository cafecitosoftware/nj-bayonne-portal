import { onMounted, ref } from 'vue'

const DEFAULT_INDEX_ENDPOINT = './data/events/index.json'

function decodeIcsText(value = '') {
    return value
        .replace(/\\n/gi, '\n')
        .replace(/\\,/g, ',')
        .replace(/\\;/g, ';')
        .replace(/\\\\/g, '\\')
        .replace(/\s+\n/g, '\n')
        .trim()
}

// Shared function to apply source metadata to events
function applySourceMetaToEvents(rawEvents = [], sourceName, sourceColor) {
    return rawEvents.map(event => ({
        ...event,
        source: sourceName,
        color: sourceColor,
    }))
}

// Function to load JSON sources
async function loadJsonSource(source) {
    try {
        const response = await fetch(source.endpoint)
        if (!response.ok) {
            throw new Error(`Failed to load JSON source ${source.name}: ${response.statusText}`)
        }

        const payload = await response.json()
        const sourceName = source.name || 'Unnamed Source'
        const sourceColor = source.color || '#000000'

        console.log(`Loaded JSON source ${source.name}:`, payload)

        return {
            sourceName,
            sourceColor,
            events: applySourceMetaToEvents(payload.events || [], sourceName, sourceColor),
        }
    } catch (err) {
        console.error(`Error loading JSON source ${source.name}:`, err)
        throw err
    }
}

// Function to load iCal sources
async function loadIcalSource(source) {
    try {
        const response = await fetch(source.endpoint)
        if (!response.ok) {
            throw new Error(`Failed to load iCal source ${source.name}: ${response.statusText}`)
        }

        const sourceText = await response.text()
        const sourceName = source.name || 'Unnamed Source'
        const sourceColor = source.color || '#000000'

        const events = parseIcsToEvents(sourceText, sourceName, sourceColor)

        return {
            sourceName,
            sourceColor,
            events,
        }
    } catch (err) {
        console.error(`Error loading iCal source ${source.name}:`, err)
        throw err
    }
}

// Helper to parse iCal dates
function parseIcsDate(value) {
    if (!value) return null

    // All-day date (YYYYMMDD)
    if (/^\d{8}$/.test(value)) {
        return {
            date: `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`,
            allDay: true,
        }
    }

    // Date-time value (YYYYMMDDTHHmmss or YYYYMMDDTHHmmssZ)
    const match = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/)
    if (!match) return null

    const [, year, month, day, hour, minute, second, isUtc] = match

    // UTC values should be converted to local wall-clock time before rendering.
    if (isUtc) {
        const utcDate = new Date(Date.UTC(
            Number(year),
            Number(month) - 1,
            Number(day),
            Number(hour),
            Number(minute),
            Number(second)
        ))

        const localYear = String(utcDate.getFullYear())
        const localMonth = String(utcDate.getMonth() + 1).padStart(2, '0')
        const localDay = String(utcDate.getDate()).padStart(2, '0')
        const localHour = String(utcDate.getHours()).padStart(2, '0')
        const localMinute = String(utcDate.getMinutes()).padStart(2, '0')

        return {
            date: `${localYear}-${localMonth}-${localDay}`,
            time: `${localHour}:${localMinute}`,
            allDay: false,
        }
    }

    return {
        date: `${year}-${month}-${day}`,
        time: `${hour}:${minute}`,
        allDay: false,
    }
}

// Helper to parse iCal text to events
function parseIcsToEvents(icsText, sourceName, sourceColor) {
    const lines = icsText
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .split('\n')

    // Unfold multiline iCal fields (continuation lines start with whitespace)
    const unfolded = []
    for (const line of lines) {
        if ((line.startsWith(' ') || line.startsWith('\t')) && unfolded.length > 0) {
            unfolded[unfolded.length - 1] += line.slice(1)
        } else {
            unfolded.push(line)
        }
    }

    const parsedEvents = []
    let current = null

    for (const line of unfolded) {
        if (line === 'BEGIN:VEVENT') {
            current = {}
            continue
        }

        if (line === 'END:VEVENT') {
            if (current?.summary) {
                // Prefer DTSTART/DTEND when available. Fallback to DTSTAMP for start only.
                const startRaw = current.dtstart || current.dtstamp
                const endRaw = current.dtend
                const start = parseIcsDate(startRaw)
                const end = parseIcsDate(endRaw)
                const date = start?.date
                const time = start?.time
                const endDate = end?.date
                const endTime = end?.time
                const allDay = start?.allDay ?? (!time && !endTime)

                if (date) {
                    parsedEvents.push({
                        id: current.uid || `${sourceName}-${date}-${current.summary}`,
                        title: current.summary,
                        date,
                        time,
                        endDate,
                        endTime,
                        allDay,
                        url: current.url,
                        location: current.location,
                        description: current.description,
                    })
                }
            }

            current = null
            continue
        }

        if (!current) continue

        const separatorIndex = line.indexOf(':')
        if (separatorIndex === -1) continue

        const keyPart = line.slice(0, separatorIndex)
        const value = line.slice(separatorIndex + 1)
        const key = keyPart.split(';')[0].toUpperCase()

        if (key === 'UID') current.uid = value
        if (key === 'SUMMARY') current.summary = decodeIcsText(value)
        if (key === 'DESCRIPTION') current.description = decodeIcsText(value)
        if (key === 'LOCATION') current.location = decodeIcsText(value)
        if (key === 'URL') current.url = value
        if (key === 'DTSTART') current.dtstart = value
        if (key === 'DTEND') current.dtend = value
        if (key === 'DTSTAMP') current.dtstamp = value
    }

    return applySourceMetaToEvents(parsedEvents, sourceName, sourceColor)
}

export function useEventSources(indexEndpoint = DEFAULT_INDEX_ENDPOINT) {
    const events = ref([])
    const eventsLegend = ref({})
    const loading = ref(true)
    const error = ref(null)

    const loadEvents = async () => {
        loading.value = true
        error.value = null
        events.value = []
        eventsLegend.value = {}

        try {
            const indexResponse = await fetch(indexEndpoint)
            if (!indexResponse.ok) {
                throw new Error(`Failed to load event index: ${indexResponse.statusText}`)
            }

            const indexPayload = await indexResponse.json()
            const sources = indexPayload.sources || []
            const sourcesEnabled = sources.filter(source => source.enabled === true)

            const sourcePromises = sourcesEnabled.map(async source => {
                try {
                    const result = source.type === 'ical'
                        ? await loadIcalSource(source)
                        : await loadJsonSource(source)

                    events.value.push(...result.events)
                    eventsLegend.value[result.sourceName] = result.sourceColor
                } catch (sourceError) {
                    console.error(`Error loading source ${source.name}:`, sourceError)
                }
            })

            await Promise.all(sourcePromises)
            events.value.sort((a, b) => new Date(a.date) - new Date(b.date))
        } catch (loadError) {
            error.value = loadError.message
        } finally {
            loading.value = false
        }
    }

    onMounted(loadEvents)

    return {
        events,
        eventsLegend,
        loading,
        error,
        reload: loadEvents,
    }
}