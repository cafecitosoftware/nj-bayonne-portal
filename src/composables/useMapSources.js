import { onMounted, ref } from 'vue'

const DEFAULT_INDEX_ENDPOINT = '/data/maps/index.json'

// Function to load JSON sources
export function useMapSources(indexEndpoint = DEFAULT_INDEX_ENDPOINT) {
    const mapCenter = ref({ lat: 0, lng: 0 })
    const sources = ref([])
    const locations = ref([])
    const loading = ref(false)
    const error = ref(null)

    const resolveEndpoint = (endpoint) => {
        if (!endpoint) {
            return null
        }

        // Backward compatibility for older payloads where map data was stored under /data/maps.
        if (endpoint.startsWith('/data/events/') && endpoint.endsWith('.json')) {
            return endpoint.replace('/data/events/', '/data/maps/')
        }

        return endpoint
    }

    const fetchSource = async (source) => {
        if (!source?.enabled || source.type !== 'json') {
            return []
        }

        const endpoint = resolveEndpoint(source.endpoint)
        if (!endpoint) {
            return []
        }

        const sourceResponse = await fetch(endpoint)
        if (!sourceResponse.ok) {
            throw new Error(`Failed to load map source ${source.id}: ${sourceResponse.statusText}`)
        }

        const sourcePayload = await sourceResponse.json()
        if (!Array.isArray(sourcePayload)) {
            return []
        }

        return sourcePayload
            .filter((item) => Number.isFinite(item?.lat) && Number.isFinite(item?.lng))
            .map((item) => ({
                lat: Number(item.lat),
                lng: Number(item.lng),
                name: item.name || source.name || 'Map Location',
                description: item.description || '',
                sourceId: source.id,
                sourceName: source.name || source.id,
                sourceColor: source.color || '#1d4ed8'
            }))
    }

    const loadMap = async () => {
        loading.value = true
        error.value = null
        try {
            const indexResponse = await fetch(indexEndpoint)
            if (!indexResponse.ok) {
                throw new Error(`Failed to load map index: ${indexResponse.statusText}`)
            }

            const indexPayload = await indexResponse.json()
            mapCenter.value = indexPayload?.center || { lat: 0, lng: 0 }

            const allLocations = []
            const enabledSources = (Array.isArray(indexPayload?.sources) ? indexPayload.sources : [])
                .filter((source) => source?.enabled)

            sources.value = enabledSources.map((source) => ({
                id: source.id,
                name: source.name || source.id,
                color: source.color || '#1d4ed8'
            }))

            for (const source of enabledSources) {
                const sourceLocations = await fetchSource(source)
                allLocations.push(...sourceLocations)
            }

            locations.value = allLocations
        } catch (loadError) {
            error.value = loadError.message
            sources.value = []
            locations.value = []
        } finally {
            loading.value = false
        }
    }

    onMounted(loadMap)

    return {
        mapCenter,
        sources,
        locations,
        loading,
        error
    }
}