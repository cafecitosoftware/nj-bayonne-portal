import { onMounted, ref } from 'vue'

const DEFAULT_INDEX_ENDPOINT = '/data/events/index.json'

export function useEventSources(indexEndpoint = DEFAULT_INDEX_ENDPOINT) {
    const events = ref([])
    const eventsLegend = ref({})
    const loading = ref(true)
    const error = ref(null)

    const loadEvents = async () => {
        loading.value = true
        error.value = null

        // Fetch the event index
        try {
            const indexResponse = await fetch(indexEndpoint)
            if (!indexResponse.ok) {
                throw new Error(`Failed to load event index: ${indexResponse.statusText}`)
            }
            let indexPayload = await indexResponse.json()

            // Get the sources from the payload, defaulting to an empty array if not present
            const sources = indexPayload.sources || []
            
            // Filter to include only souces with enabled set to true
            const sourcesEnabled = sources.filter(source => source.enabled === true)
            
            // Fetch all enabled sources in parallel
            const sourcePromises = sourcesEnabled.map(async (source) => {
                try {
                    const sourceRsponse = await fetch(source.endpoint)
                    let sourcePayload = await sourceRsponse.json()
                    console.log(`Loaded source ${source.name}:`, sourcePayload)
                    const sourceName = source.name || 'Unnamed Source'
                    const sourceColor = source.color || '#000000' // Default to black if no color provided
                    // Add source name and color to each event
                    sourcePayload.events = (sourcePayload.events || []).map(event => ({
                        ...event,
                        source: sourceName,
                        color: sourceColor
                    }))
                    events.value.push(...sourcePayload.events)
                    eventsLegend.value[sourceName] = sourceColor

                } catch (err) {
                    console.error(`Error loading source ${source.name}:`, err)
                }
            })

            // Sort events by date after all sources have been loaded
            await Promise.all(sourcePromises)
            events.value.sort((a, b) => new Date(a.date) - new Date(b.date))

        } catch (err) {
            error.value = err.message
            loading.value = false
            return
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
        reload: loadEvents
    }
}