import { onMounted, ref } from 'vue'

const DEFAULT_INDEX_ENDPOINT = '/data/maps/index.json'
const ASSET_BASE_URL = import.meta.env.BASE_URL || '/'

function resolveAssetUrl(endpoint) {
    if (!endpoint) {
        return null
    }

    if (/^https?:\/\//i.test(endpoint)) {
        return endpoint
    }

    const normalized = endpoint.replace(/^\.\//, '').replace(/^\//, '')
    return `${ASSET_BASE_URL}${normalized}`
}

// Function to load JSON sources
export function useMapSources(indexEndpoint = DEFAULT_INDEX_ENDPOINT) {
    const mapCenter = ref({ lat: 0, lng: 0 })
    const sources = ref([])
    const locations = ref([])
    const polygons = ref([])
    const loading = ref(false)
    const error = ref(null)

    const resolveEndpoint = (endpoint) => {
        if (!endpoint) {
            return null
        }

        // Backward compatibility for older payloads where map data was stored under /data/maps.
        if (endpoint.startsWith('/data/events/') && endpoint.endsWith('.json')) {
            endpoint = endpoint.replace('/data/events/', '/data/maps/')
        }

        if (endpoint.startsWith('./data/events/') && endpoint.endsWith('.json')) {
            endpoint = endpoint.replace('./data/events/', './data/maps/')
        }

        return resolveAssetUrl(endpoint)
    }

    const normalizeBorder = (border) => {
        if (!Array.isArray(border)) {
            return []
        }

        return border
            .filter((point) => Number.isFinite(point?.lat) && Number.isFinite(point?.lng))
            .map((point) => ({
                lat: Number(point.lat),
                lng: Number(point.lng)
            }))
    }

    const borderCenter = (border) => {
        if (!Array.isArray(border) || border.length === 0) {
            return null
        }

        const totals = border.reduce((acc, point) => {
            return {
                lat: acc.lat + point.lat,
                lng: acc.lng + point.lng
            }
        }, { lat: 0, lng: 0 })

        return {
            lat: totals.lat / border.length,
            lng: totals.lng / border.length
        }
    }

    const fetchSource = async (source) => {
        if (!source?.enabled || source.type !== 'json') {
            return { locations: [], polygons: [] }
        }

        const endpoint = resolveEndpoint(source.endpoint)
        if (!endpoint) {
            return { locations: [], polygons: [] }
        }

        const sourceResponse = await fetch(endpoint)
        if (!sourceResponse.ok) {
            throw new Error(`Failed to load map source ${source.id}: ${sourceResponse.statusText}`)
        }

        const sourcePayload = await sourceResponse.json()
        if (!Array.isArray(sourcePayload)) {
            return { locations: [], polygons: [] }
        }

        const mappedLocations = sourcePayload
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

        const mappedPolygons = sourcePayload
            .map((item) => {
                const paths = normalizeBorder(item?.border)
                if (paths.length < 3) {
                    return null
                }

                const center = borderCenter(paths)
                if (!center) {
                    return null
                }

                return {
                    name: item.name || source.name || 'Map Area',
                    description: item.description || '',
                    paths,
                    lat: center.lat,
                    lng: center.lng,
                    sourceId: source.id,
                    sourceName: source.name || source.id,
                    sourceColor: source.color || '#1d4ed8'
                }
            })
            .filter(Boolean)

        return {
            locations: mappedLocations,
            polygons: mappedPolygons
        }
    }

    const loadMap = async () => {
        loading.value = true
        error.value = null
        try {
            const resolvedIndexEndpoint = resolveAssetUrl(indexEndpoint)
            const indexResponse = await fetch(resolvedIndexEndpoint)
            if (!indexResponse.ok) {
                throw new Error(`Failed to load map index: ${indexResponse.statusText}`)
            }

            const indexPayload = await indexResponse.json()
            mapCenter.value = indexPayload?.center || { lat: 0, lng: 0 }

            const allLocations = []
            const allPolygons = []
            const enabledSources = (Array.isArray(indexPayload?.sources) ? indexPayload.sources : [])
                .filter((source) => source?.enabled)

            sources.value = enabledSources.map((source) => ({
                id: source.id,
                name: source.name || source.id,
                color: source.color || '#1d4ed8'
            }))

            for (const source of enabledSources) {
                const sourceFeatures = await fetchSource(source)
                allLocations.push(...sourceFeatures.locations)
                allPolygons.push(...sourceFeatures.polygons)
            }

            locations.value = allLocations
            polygons.value = allPolygons
        } catch (loadError) {
            error.value = loadError.message
            sources.value = []
            locations.value = []
            polygons.value = []
        } finally {
            loading.value = false
        }
    }

    onMounted(loadMap)

    return {
        mapCenter,
        sources,
        locations,
        polygons,
        loading,
        error
    }
}