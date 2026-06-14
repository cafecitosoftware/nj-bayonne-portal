<script setup>
import { useMapSources } from '@/composables/useMapSources'
import { computed, ref, watch } from 'vue'
import { GoogleMap, InfoWindow, Marker, MarkerCluster } from 'vue3-google-map'

const { mapCenter, sources, locations, loading, error } = useMapSources()
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const selectedSourceIds = ref([])
const activeLocation = ref(null)

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

const zoom = computed(() => (filteredLocations.value.length > 0 ? 13 : 11))
const legendSources = computed(() => {
  return sources.value.map((source) => ({
    ...source,
    count: locations.value.filter((location) => location.sourceId === source.id).length
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

function onMapClick() {
  activeLocation.value = null
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
      <p v-if="!allSelected" class="text-xs text-gray-500 mt-3">Showing {{ filteredLocations.length }} of {{ locations.length }} locations.</p>
    </div>

    <div class="relative rounded-xl overflow-hidden border border-gray-200">
    <div v-if="loading" class="absolute inset-0 z-10 bg-white/80 flex items-center justify-center text-gray-700 font-medium">
      Loading map data...
    </div>
    <div v-else-if="error" class="absolute inset-0 z-10 bg-red-50 flex items-center justify-center text-red-700 text-center px-4">
      {{ error }}
    </div>
    <div v-else-if="filteredLocations.length === 0" class="absolute inset-0 z-10 bg-blue-50/80 flex items-center justify-center text-blue-900 text-center px-4">
      Select at least one source to see map markers.
    </div>

    <GoogleMap
      :api-key="googleMapsApiKey"
      style="width: 100%; height: 500px"
      :center="mapCenter"
      :zoom="zoom"
      @click="onMapClick"
    >
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
</template>