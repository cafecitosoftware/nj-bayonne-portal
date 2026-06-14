<script setup>
import { useMapSources } from '@/composables/useMapSources'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { GoogleMap, InfoWindow, Marker, MarkerCluster, Polygon } from 'vue3-google-map'

const { mapCenter, sources, locations, polygons, loading, error } = useMapSources()
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const selectedSourceIds = ref([])
const activeLocation = ref(null)
const searchQuery = ref('')
const isMobileViewport = ref(false)
const showMobileMap = ref(false)

const MOBILE_BREAKPOINT = 768

function updateViewportState() {
  isMobileViewport.value = globalThis?.window?.innerWidth < MOBILE_BREAKPOINT
  if (!isMobileViewport.value) {
    showMobileMap.value = false
  }
}

onMounted(() => {
  updateViewportState()
  globalThis?.window?.addEventListener('resize', updateViewportState)
})

onBeforeUnmount(() => {
  globalThis?.window?.removeEventListener('resize', updateViewportState)
})

watch(
  sources,
  (newSources) => {
    const availableIds = newSources.map((source) => source.id)
    if (selectedSourceIds.value.length === 0) {
      selectedSourceIds.value = availableIds
      return
    }

    selectedSourceIds.value = selectedSourceIds.value.filter((id) => availableIds.includes(id))
  },
  { immediate: true }
)

const allSourceIds = computed(() => sources.value.map((source) => source.id))
const selectedSet = computed(() => new Set(selectedSourceIds.value))
const allSelected = computed(() => allSourceIds.value.length > 0 && selectedSourceIds.value.length === allSourceIds.value.length)

const filteredLocations = computed(() => {
  if (selectedSet.value.size === 0) {
    return []
  }

  return locations.value.filter((location) => selectedSet.value.has(location.sourceId))
})

const filteredPolygons = computed(() => {
  if (selectedSet.value.size === 0) {
    return []
  }

  return polygons.value.filter((polygon) => selectedSet.value.has(polygon.sourceId))
})

const totalFeatureCount = computed(() => locations.value.length + polygons.value.length)
const filteredFeatureCount = computed(() => filteredLocations.value.length + filteredPolygons.value.length)

const mobileListItems = computed(() => {
  const normalizedQuery = searchQuery.value.trim().toLowerCase()
  const items = [
    ...filteredLocations.value.map((location) => ({
      ...location,
      featureType: 'Location',
      distanceMiles: distanceInMiles(mapCenter.value, location)
    })),
    ...filteredPolygons.value.map((polygon) => ({
      ...polygon,
      featureType: 'Area',
      distanceMiles: distanceInMiles(mapCenter.value, polygon)
    }))
  ]

  const queryFilteredItems = normalizedQuery
    ? items.filter((item) => {
        return (
          item.name.toLowerCase().includes(normalizedQuery) ||
          item.sourceName.toLowerCase().includes(normalizedQuery) ||
          (item.description || '').toLowerCase().includes(normalizedQuery)
        )
      })
    : items

  return queryFilteredItems.sort((a, b) => a.distanceMiles - b.distanceMiles)
})

const zoom = computed(() => (filteredFeatureCount.value > 0 ? 13 : 11))
const legendSources = computed(() => {
  return sources.value.map((source) => ({
    ...source,
    count:
      locations.value.filter((location) => location.sourceId === source.id).length +
      polygons.value.filter((polygon) => polygon.sourceId === source.id).length
  }))
})

function toggleSource(sourceId) {
  if (selectedSet.value.has(sourceId)) {
    selectedSourceIds.value = selectedSourceIds.value.filter((id) => id !== sourceId)
  } else {
    selectedSourceIds.value = [...selectedSourceIds.value, sourceId]
  }
}

function selectAllSources() {
  selectedSourceIds.value = [...allSourceIds.value]
}

function clearSources() {
  selectedSourceIds.value = []
}

function onMarkerClick(location) {
  if (
    activeLocation.value?.lat === location.lat &&
    activeLocation.value?.lng === location.lng &&
    activeLocation.value?.sourceId === location.sourceId
  ) {
    activeLocation.value = null
    return
  }

  activeLocation.value = location
}

function onPolygonClick(polygon) {
  if (
    activeLocation.value?.lat === polygon.lat &&
    activeLocation.value?.lng === polygon.lng &&
    activeLocation.value?.sourceId === polygon.sourceId &&
    activeLocation.value?.name === polygon.name
  ) {
    activeLocation.value = null
    return
  }

  activeLocation.value = polygon
}

function onMapClick() {
  activeLocation.value = null
}

function openMobileMap() {
  showMobileMap.value = true
}

function closeMobileMap() {
  showMobileMap.value = false
  activeLocation.value = null
}

function distanceInMiles(from, to) {
  if (!from || !to) {
    return Number.POSITIVE_INFINITY
  }

  const toRadians = (value) => (value * Math.PI) / 180
  const earthRadiusMiles = 3958.8
  const deltaLat = toRadians(to.lat - from.lat)
  const deltaLng = toRadians(to.lng - from.lng)
  const fromLat = toRadians(from.lat)
  const toLat = toRadians(to.lat)

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(deltaLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadiusMiles * c
}

function formatDistance(miles) {
  if (!Number.isFinite(miles)) {
    return 'Distance unavailable'
  }

  return `${miles.toFixed(1)} mi from city center`
}

function directionsUrl(item) {
  return `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`
}

function markerOptions(location) {
  const symbolPath = globalThis?.google?.maps?.SymbolPath?.CIRCLE

  return {
    position: { lat: location.lat, lng: location.lng },
    title: location.name,
    icon: symbolPath
      ? {
          path: symbolPath,
          fillColor: location.sourceColor,
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 1.5,
          scale: 8
        }
      : undefined
  }
}

function polygonOptions(polygon) {
  return {
    paths: polygon.paths,
    strokeColor: polygon.sourceColor,
    strokeOpacity: 0.95,
    strokeWeight: 2,
    fillColor: polygon.sourceColor,
    fillOpacity: 0.2,
    clickable: true,
    zIndex: 1
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 class="text-blue-900 font-extrabold tracking-tight">Map Sources</h3>
          <p class="text-gray-500 text-sm">Select layers to display on the map.</p>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" class="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full hover:bg-blue-100 transition" @click="selectAllSources">Show all</button>
          <button type="button" class="text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-200 transition" @click="clearSources">Clear</button>
        </div>
      </div>

      <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <li v-for="source in legendSources" :key="source.id">
          <label class="w-full flex items-center justify-between gap-3 rounded-xl border border-gray-200 px-3 py-2 cursor-pointer hover:border-blue-300 hover:bg-blue-50/40 transition">
            <span class="flex items-center gap-2 min-w-0">
              <span class="w-3 h-3 rounded-full border border-white shadow-sm" :style="{ backgroundColor: source.color }" />
              <span class="text-sm font-semibold text-gray-800 truncate">{{ source.name }}</span>
            </span>
            <span class="flex items-center gap-2 shrink-0">
              <span class="text-xs text-gray-500">{{ source.count }}</span>
              <input
                :checked="selectedSet.has(source.id)"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-blue-700 focus:ring-blue-500"
                @change="toggleSource(source.id)"
              >
            </span>
          </label>
        </li>
      </ul>
      <p v-if="!allSelected" class="text-xs text-gray-500 mt-3">Showing {{ filteredFeatureCount }} of {{ totalFeatureCount }} map features.</p>
    </div>

    <div class="md:hidden bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h3 class="text-blue-900 font-extrabold tracking-tight">Nearby Places</h3>
          <p class="text-xs text-gray-500">List view is easier on small screens. Open the map when needed.</p>
        </div>
        <button
          type="button"
          class="shrink-0 text-xs font-semibold text-white bg-blue-700 px-3 py-2 rounded-full hover:bg-blue-800 transition"
          @click="openMobileMap"
        >
          Open Interactive Map
        </button>
      </div>

      <div class="mt-3">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search parks, splash pads, and areas"
          class="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>

      <ul class="mt-3 space-y-2 max-h-[420px] overflow-y-auto pr-1">
        <li v-for="item in mobileListItems" :key="`${item.sourceId}-${item.name}-${item.lat}-${item.lng}`" class="rounded-xl border border-gray-200 p-3">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-[11px] font-bold uppercase tracking-wide" :style="{ color: item.sourceColor }">{{ item.sourceName }}</p>
              <p class="text-sm font-semibold text-gray-900 leading-snug mt-0.5">{{ item.name }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ item.featureType }} • {{ formatDistance(item.distanceMiles) }}</p>
            </div>
            <a
              :href="directionsUrl(item)"
              target="_blank"
              rel="noreferrer"
              class="shrink-0 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1.5 rounded-full hover:bg-blue-100"
            >
              Directions
            </a>
          </div>
          <p v-if="item.description" class="text-xs text-gray-600 mt-2">{{ item.description }}</p>
        </li>
      </ul>

      <p v-if="mobileListItems.length === 0" class="text-sm text-gray-500 mt-3">
        No results for your filters or search.
      </p>
    </div>

    <div class="hidden md:block relative rounded-xl overflow-hidden border border-gray-200">
    <div v-if="loading" class="absolute inset-0 z-10 bg-white/80 flex items-center justify-center text-gray-700 font-medium">
      Loading map data...
    </div>
    <div v-else-if="error" class="absolute inset-0 z-10 bg-red-50 flex items-center justify-center text-red-700 text-center px-4">
      {{ error }}
    </div>
    <div v-else-if="filteredFeatureCount === 0" class="absolute inset-0 z-10 bg-blue-50/80 flex items-center justify-center text-blue-900 text-center px-4">
      Select at least one source to see map features.
    </div>

    <GoogleMap
      :api-key="googleMapsApiKey"
      style="width: 100%; height: 500px"
      :center="mapCenter"
      :zoom="zoom"
      @click="onMapClick"
    >
      <Polygon
        v-for="(polygon, i) in filteredPolygons"
        :key="`${polygon.sourceId}-${polygon.name}-${i}`"
        :options="polygonOptions(polygon)"
        @click="onPolygonClick(polygon)"
      />

      <MarkerCluster>
        <Marker
          v-for="(location, i) in filteredLocations"
          :key="`${location.sourceId}-${i}`"
          :options="markerOptions(location)"
          @click="onMarkerClick(location)"
        />
      </MarkerCluster>

      <InfoWindow
        v-if="activeLocation"
        :options="{ position: { lat: activeLocation.lat, lng: activeLocation.lng } }"
      >
        <div class="max-w-[220px]">
          <p class="text-[11px] font-bold uppercase tracking-wide mb-1" :style="{ color: activeLocation.sourceColor }">
            {{ activeLocation.sourceName }}
          </p>
          <p class="text-sm font-semibold text-gray-900 leading-snug">{{ activeLocation.name }}</p>
          <p v-if="activeLocation.description" class="text-xs text-gray-600 mt-1">{{ activeLocation.description }}</p>
        </div>
      </InfoWindow>
    </GoogleMap>
    </div>

    <div
      v-if="isMobileViewport && showMobileMap"
      class="fixed inset-0 z-50 bg-white flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Interactive map"
    >
      <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div>
          <p class="text-sm font-bold text-blue-900">Interactive Map</p>
          <p class="text-xs text-gray-500">Pinch and drag to explore locations.</p>
        </div>
        <button
          type="button"
          class="text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full"
          @click="closeMobileMap"
        >
          Close
        </button>
      </div>

      <div class="relative flex-1">
        <div v-if="loading" class="absolute inset-0 z-10 bg-white/80 flex items-center justify-center text-gray-700 font-medium">
          Loading map data...
        </div>
        <div v-else-if="error" class="absolute inset-0 z-10 bg-red-50 flex items-center justify-center text-red-700 text-center px-4">
          {{ error }}
        </div>
        <div v-else-if="filteredFeatureCount === 0" class="absolute inset-0 z-10 bg-blue-50/80 flex items-center justify-center text-blue-900 text-center px-4">
          Select at least one source to see map features.
        </div>

        <GoogleMap
          :api-key="googleMapsApiKey"
          style="width: 100%; height: 100%"
          :center="mapCenter"
          :zoom="zoom"
          @click="onMapClick"
        >
          <Polygon
            v-for="(polygon, i) in filteredPolygons"
            :key="`${polygon.sourceId}-${polygon.name}-${i}`"
            :options="polygonOptions(polygon)"
            @click="onPolygonClick(polygon)"
          />

          <MarkerCluster>
            <Marker
              v-for="(location, i) in filteredLocations"
              :key="`${location.sourceId}-${i}`"
              :options="markerOptions(location)"
              @click="onMarkerClick(location)"
            />
          </MarkerCluster>

          <InfoWindow
            v-if="activeLocation"
            :options="{ position: { lat: activeLocation.lat, lng: activeLocation.lng } }"
          >
            <div class="max-w-[220px]">
              <p class="text-[11px] font-bold uppercase tracking-wide mb-1" :style="{ color: activeLocation.sourceColor }">
                {{ activeLocation.sourceName }}
              </p>
              <p class="text-sm font-semibold text-gray-900 leading-snug">{{ activeLocation.name }}</p>
              <p v-if="activeLocation.description" class="text-xs text-gray-600 mt-1">{{ activeLocation.description }}</p>
            </div>
          </InfoWindow>
        </GoogleMap>
      </div>
    </div>
  </div>
</template>