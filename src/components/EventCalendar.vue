<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useEventSources } from '@/composables/useEventSources'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'

const { events, eventsLegend, loading, error } = useEventSources()

const selectedEvent = ref(null)
const selectedSources = ref([])
const descriptionExpanded = ref(false)
const descriptionPreviewLength = 280

const sourceOptions = computed(() =>
  Object.entries(eventsLegend.value || {}).map(([name, color]) => ({ name, color }))
)

watch(sourceOptions, (sources) => {
  if (sources.length === 0) return
  if (selectedSources.value.length === 0) {
    selectedSources.value = sources.map(source => source.name)
  }
}, { immediate: true })

const filteredEvents = computed(() =>
  events.value.filter(event => selectedSources.value.includes(event.source))
)

const visibleEventCount = computed(() => filteredEvents.value.length)

function toggleSource(sourceName) {
  if (selectedSources.value.includes(sourceName)) {
    selectedSources.value = selectedSources.value.filter(name => name !== sourceName)
  } else {
    selectedSources.value = [...selectedSources.value, sourceName]
  }
}

function selectAllSources() {
  selectedSources.value = sourceOptions.value.map(source => source.name)
}

function clearSources() {
  selectedSources.value = []
  closeSelectedEvent()
  descriptionExpanded.value = false
}

function closeSelectedEvent() {
  selectedEvent.value = null
  descriptionExpanded.value = false
}

function isDescriptionLong(text) {
  return Boolean(text && text.length > descriptionPreviewLength)
}

const displayDescription = computed(() => {
  const description = selectedEvent.value?.description || ''
  if (!isDescriptionLong(description) || descriptionExpanded.value) return description
  return `${description.slice(0, descriptionPreviewLength).trimEnd()}...`
})

function buildOutboundUrl(rawUrl) {
  if (!rawUrl) return ''
  try {
    const url = new URL(rawUrl)
    url.searchParams.set('utm_source', 'cafecito-software')
    url.searchParams.set('utm_medium', 'calendar')
    url.searchParams.set('utm_campaign', 'bayonne-portal')
    return url.toString()
  } catch {
    return rawUrl
  }
}

function toDateTime(date, time) {
  if (!date) return undefined
  return time ? `${date}T${time}:00` : date
}

const calendarEvents = computed(() =>
  filteredEvents.value.map(event => ({
    id: event.id,
    title: event.title,
    start: toDateTime(event.date, event.time),
    end: toDateTime(event.endDate, event.endTime),
    allDay: !(event.time || event.endTime),
    color: event.color || '#3788d8',
    extendedProps: {
      time: event.time,
      endDate: event.endDate,
      endTime: event.endTime,
      url: event.url,
      location: event.location,
      description: event.description,
      source: event.source,
    },
  }))
)

function handleEventClick(info) {
  descriptionExpanded.value = false
  selectedEvent.value = {
    title: info.event.title,
    date: info.event.startStr,
    time: info.event.extendedProps.time,
    endDate: info.event.extendedProps.endDate,
    endTime: info.event.extendedProps.endTime,
    url: info.event.extendedProps.url,
    location: info.event.extendedProps.location,
    description: info.event.extendedProps.description,
    source: info.event.extendedProps.source,
    color: info.event.backgroundColor,
  }
}

function handleKeydown(event) {
  if (event.key === 'Escape' && selectedEvent.value) {
    closeSelectedEvent()
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

function formatTime(timeStr) {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':')
  const date = new Date()
  date.setHours(+h, +m)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, listPlugin],
  initialView: 'listMonth',
  weekends: true,
  events: calendarEvents.value,
  eventClick: handleEventClick,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,listMonth',
  },
  buttonText: {
    today: 'Today',
    month: 'Month',
    list: 'List',
  },
  displayEventTime: true,
  eventTimeFormat: {
    hour: 'numeric',
    minute: '2-digit',
    meridiem: 'short',
  },
  height: 'auto',
  eventDisplay: 'block',
  dayMaxEvents: 2,
}))

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 text-gray-400">
      <svg class="animate-spin h-10 w-10 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      <p class="text-sm font-medium">Loading events…</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700">
      <p class="text-2xl mb-2">⚠️</p>
      <p class="font-semibold">Failed to load events</p>
      <p class="text-sm text-red-500 mt-1">{{ error }}</p>
    </div>

    <!-- Calendar + Detail Panel -->
    <div v-else>

      <!-- Filter Bar -->
      <div class="mb-5 rounded-xl border border-gray-200 bg-white p-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">Filter by Source</p>
            <p class="text-sm text-gray-600 mt-1">
              Showing <span class="font-semibold text-gray-900">{{ visibleEventCount }}</span>
              of <span class="font-semibold text-gray-900">{{ events.length }}</span> events
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="selectAllSources"
              class="text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition"
            >
              Select all
            </button>
            <button
              type="button"
              @click="clearSources"
              class="text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition"
            >
              Clear
            </button>
          </div>
        </div>
        <div class="mt-3 flex flex-wrap gap-2">
          <button
            v-for="source in sourceOptions"
            :key="source.name"
            type="button"
            @click="toggleSource(source.name)"
            :class="[
              'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition',
              selectedSources.includes(source.name)
                ? 'border-blue-200 bg-blue-50 text-blue-800'
                : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
            ]"
          >
            <span :style="{ backgroundColor: source.color }" class="w-2.5 h-2.5 rounded-full"></span>
            <span>{{ source.name }}</span>
          </button>
        </div>
      </div>

      <!-- Calendar -->
      <div class="rounded-xl overflow-hidden border border-gray-200">
        <FullCalendar :options="calendarOptions" />
      </div>

      <p v-if="visibleEventCount === 0" class="mt-3 text-sm text-center text-gray-500">
        No events match the selected filters.
      </p>

      <!-- Event Detail Popover -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="selectedEvent"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <button
            type="button"
            class="absolute inset-0 bg-gray-900/40"
            aria-label="Close event details"
            @click="closeSelectedEvent"
          ></button>

          <div class="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white rounded-2xl border border-gray-200 shadow-2xl">
            <!-- Colored top bar matching event source -->
            <div :style="{ backgroundColor: selectedEvent.color }" class="h-1.5 w-full"></div>

            <div class="p-6">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-gray-900 leading-snug">{{ selectedEvent.title }}</h3>
                  <p class="text-sm text-gray-500 mt-1">{{ selectedEvent.source }}</p>
                </div>
                <button
                  @click="closeSelectedEvent"
                  class="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
                  aria-label="Close"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="flex items-start gap-2">
                  <span class="text-blue-500 mt-0.5">📅</span>
                  <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</p>
                    <p class="text-sm text-gray-700 mt-0.5">{{ formatDate(selectedEvent.date) }}</p>
                  </div>
                </div>
                <div v-if="selectedEvent.time" class="flex items-start gap-2">
                  <span class="text-blue-500 mt-0.5">🕐</span>
                  <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Time</p>
                    <p class="text-sm text-gray-700 mt-0.5">{{ formatTime(selectedEvent.time) }}</p>
                  </div>
                </div>
                <div v-if="selectedEvent.endTime" class="flex items-start gap-2">
                  <span class="text-blue-500 mt-0.5">⏱️</span>
                  <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Ends</p>
                    <p class="text-sm text-gray-700 mt-0.5">{{ formatTime(selectedEvent.endTime) }}</p>
                  </div>
                </div>
                <div v-if="selectedEvent.location" class="flex items-start gap-2">
                  <span class="text-blue-500 mt-0.5">📍</span>
                  <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Location</p>
                    <p class="text-sm text-gray-700 mt-0.5">{{ selectedEvent.location }}</p>
                  </div>
                </div>
              </div>

              <p v-if="selectedEvent.description" class="mt-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4 whitespace-pre-line">
                {{ displayDescription }}
              </p>

              <button
                v-if="isDescriptionLong(selectedEvent.description)"
                type="button"
                @click="descriptionExpanded = !descriptionExpanded"
                class="mt-2 text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline"
              >
                {{ descriptionExpanded ? 'Show less' : 'Show more' }}
              </button>

              <div v-if="selectedEvent.url" class="mt-4 pt-4 border-t border-gray-100">
                <a
                  :href="buildOutboundUrl(selectedEvent.url)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline"
                >
                  Open Event Page
                  <span aria-hidden="true">↗</span>
                </a>
                <p class="mt-1 text-xs text-gray-400">
                  Opened in a new window. Referred by Cafecito Software.
                </p>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Hint when nothing selected -->
      <p v-if="!selectedEvent" class="mt-4 text-center text-xs text-gray-400">
        Click any event to see details
      </p>

    </div>
  </div>
</template>

<style>
.fc .fc-event {
  cursor: pointer;
}
</style>