import { onMounted, ref } from 'vue'

const DEFAULT_INDEX_ENDPOINT = '/data/events/index.json'

function isLocalJsonSource(source) {
  const hasLocalEndpoint =
    typeof source?.endpoint === 'string' &&
    source.endpoint.startsWith('/') &&
    !/^https?:\/\//i.test(source.endpoint)

  return source?.enabled === true && source?.type === 'json' && hasLocalEndpoint
}

function normalizeSourceEvents(source, payload) {
  const sourceEvents = Array.isArray(payload?.events) ? payload.events : []

  return sourceEvents.map((event) => ({
    ...event,
    sourceId: source.id,
    sourceName: source.name,
    sourceType: source.type,
  }))
}

export function useEventSources(indexEndpoint = DEFAULT_INDEX_ENDPOINT) {
  const events = ref([])
  const loading = ref(false)
  const error = ref(null)
  const loadedSources = ref([])
  const skippedSources = ref([])

  const loadEvents = async () => {
    loading.value = true
    error.value = null
    loadedSources.value = []
    skippedSources.value = []

    try {
      const indexResponse = await fetch(indexEndpoint)
      if (!indexResponse.ok) {
        throw new Error(`Unable to load event index: ${indexResponse.status}`)
      }

      let indexPayload
      const indexText = await indexResponse.text()
      try {
        indexPayload = JSON.parse(indexText)
      } catch (jsonError) {
        console.error('Failed to parse index JSON:', indexText.substring(0, 200))
        throw new Error(`Invalid JSON from index: ${jsonError.message}`)
      }

      const sources = Array.isArray(indexPayload?.sources) ? indexPayload.sources : []
      const allowedSources = sources.filter((source) => {
        const allowed = isLocalJsonSource(source)
        if (!allowed) {
          skippedSources.value.push(source)
        }
        return allowed
      })

      const results = await Promise.all(
        allowedSources.map(async (source) => {
          const sourceResponse = await fetch(source.endpoint)
          if (!sourceResponse.ok) {
            throw new Error(
              `Unable to load source "${source.id}": ${sourceResponse.status}`,
            )
          }

          let sourcePayload
          const sourceText = await sourceResponse.text()
          try {
            sourcePayload = JSON.parse(sourceText)
          } catch (jsonError) {
            console.error(`Failed to parse ${source.id} JSON:`, sourceText.substring(0, 200))
            throw new Error(`Invalid JSON from source "${source.id}": ${jsonError.message}`)
          }

          loadedSources.value.push(source)
          return normalizeSourceEvents(source, sourcePayload)
        }),
      )

      events.value = results.flat()
    } catch (loadError) {
      events.value = []
      error.value = loadError instanceof Error ? loadError.message : 'Failed to load events'
      console.error('Event loading error:', error.value)
    } finally {
      loading.value = false
    }
  }

  onMounted(loadEvents)

  return {
    events,
    error,
    loading,
    loadedSources,
    skippedSources,
    reload: loadEvents,
  }
}