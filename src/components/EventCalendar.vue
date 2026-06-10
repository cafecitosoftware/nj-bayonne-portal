<script setup>
import { computed, ref } from 'vue'
import { useEventSources } from '@/composables/useEventSources'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'

const { events, eventsLegend, loading, error } = useEventSources()

const selectedEvent = ref(null)

const calendarEvents = computed(() =>
  events.value.map(event => ({
    id: event.id,
    title: event.title,
    start: event.date,
    color: event.color || '#3788d8',
    extendedProps: {
      time: event.time,
      location: event.location,
      description: event.description,
      source: event.source,
    },
  }))
)

function handleEventClick(info) {
  selectedEvent.value = {
    title: info.event.title,
    date: info.event.startStr,
    time: info.event.extendedProps.time,
    location: info.event.extendedProps.location,
    description: info.event.extendedProps.description,
    source: info.event.extendedProps.source,
    color: info.event.backgroundColor,
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
  initialView: 'dayGridMonth',
  weekends: true,
  events: calendarEvents.value,
  eventClick: handleEventClick,
  eventCursor: 'pointer',
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
  height: 'auto',
  eventDisplay: 'block',
  dayMaxEvents: 3,
}))
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

      <!-- Legend -->
      <div class="flex flex-wrap items-center gap-4 mb-5 px-1">
        <span class="text-xs font-semibold uppercase tracking-wide text-gray-400">Sources:</span>
        <div
          v-for="(color, source) in eventsLegend"
          :key="source"
          class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1"
        >
          <span :style="{ backgroundColor: color }" class="w-3 h-3 rounded-full flex-shrink-0"></span>
          <span class="text-xs font-medium text-gray-700">{{ source }}</span>
        </div>
      </div>

      <!-- Calendar -->
      <div class="rounded-xl overflow-hidden border border-gray-200">
        <FullCalendar :options="calendarOptions" />
      </div>

      <!-- Event Detail Panel -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div
          v-if="selectedEvent"
          class="mt-5 bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden"
        >
          <!-- Colored top bar matching event source -->
          <div :style="{ backgroundColor: selectedEvent.color }" class="h-1.5 w-full"></div>

          <div class="p-6">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <h3 class="text-lg font-bold text-gray-900 leading-snug">{{ selectedEvent.title }}</h3>
                <p class="text-sm text-gray-500 mt-1">{{ selectedEvent.source }}</p>
              </div>
              <button
                @click="selectedEvent = null"
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
              <div v-if="selectedEvent.location" class="flex items-start gap-2">
                <span class="text-blue-500 mt-0.5">📍</span>
                <div>
                  <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Location</p>
                  <p class="text-sm text-gray-700 mt-0.5">{{ selectedEvent.location }}</p>
                </div>
              </div>
            </div>

            <p v-if="selectedEvent.description" class="mt-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
              {{ selectedEvent.description }}
            </p>
          </div>
        </div>

        <!-- Hint when nothing selected -->
        <p v-else class="mt-4 text-center text-xs text-gray-400">
          Click any event to see details
        </p>
      </transition>

    </div>
  </div>
</template>