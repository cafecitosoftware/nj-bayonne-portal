<script setup>
import { computed } from 'vue'
import { useEventSources } from '@/composables/useEventSources'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'

const { events, eventsLegend,loading, error } = useEventSources()

const calendarEvents = computed(() => {
  return events.value.map(event => ({
    title: event.title,
    start: event.date,
    color: event.color || '#3788d8' // Default color if not provided
    }))
})

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, listPlugin],
  initialView: 'dayGridMonth',
  weekends: false,
  events: calendarEvents.value,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,listMonth'
  },
  buttonText: {
    today: 'Today',
    month: 'Month',
    list: 'List'
  }
}))
</script>

<template>
  <Legend>
  <div class="mb-4">
    <h2 class="text-xl font-semibold mb-2">Event Sources</h2>
    <ul class="flex flex-wrap gap-4">
      <li v-for="(color, source) in eventsLegend" :key="source" class="flex items-center gap-2">
        <span :style="{ backgroundColor: color }" class="w-4 h-4 rounded-full"></span>
        <span>{{ source }}</span>
      </li>
    </ul>
  </div>
  </Legend>
  <FullCalendar :options="calendarOptions" />
  
</template>