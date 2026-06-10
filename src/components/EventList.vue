<script setup>
import { computed } from 'vue'

const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
  selectedDay: {
    type: [Number, null],
    default: null,
  },
})

function toDateParts(dateStr) {
  if (typeof dateStr !== 'string') return null
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  }
}

function getEventDate(event) {
  const parts = toDateParts(event?.date)
  return parts ? new Date(parts.year, parts.month - 1, parts.day) : null
}

function getToday() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

function getWeekStart(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  return new Date(d.setDate(diff))
}

function getWeekEnd(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + 6
  return new Date(d.setDate(diff))
}

const groupedEvents = computed(() => {
  let filtered = props.events

  if (props.selectedDay !== null) {
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const targetDate = new Date(year, month - 1, props.selectedDay)
    filtered = filtered.filter((event) => {
      const eventDate = getEventDate(event)
      return eventDate && eventDate.getTime() === targetDate.getTime()
    })
  }

  const today = getToday()
  const weekStart = getWeekStart(new Date(today))
  const weekEnd = getWeekEnd(new Date(today))

  const groups = {
    today: [],
    thisWeek: [],
    upcoming: [],
  }

  const sorted = [...filtered].sort((a, b) => {
    const aDate = getEventDate(a)
    const bDate = getEventDate(b)
    if (!aDate || !bDate) return 0
    if (aDate.getTime() !== bDate.getTime()) return aDate.getTime() - bDate.getTime()
    const aTime = a.time || ''
    const bTime = b.time || ''
    return aTime.localeCompare(bTime)
  })

  for (const event of sorted) {
    const eventDate = getEventDate(event)
    if (!eventDate) continue

    if (eventDate.getTime() === today.getTime()) {
      groups.today.push(event)
    } else if (eventDate >= weekStart && eventDate <= weekEnd) {
      groups.thisWeek.push(event)
    } else if (eventDate > today) {
      groups.upcoming.push(event)
    }
  }

  return groups
})

const hasAnyEvents = computed(
  () => groupedEvents.value.today.length > 0 || groupedEvents.value.thisWeek.length > 0 || groupedEvents.value.upcoming.length > 0,
)
</script>

<template>
  <div class="events-container">
    <p v-if="!hasAnyEvents" class="no-events">
      {{ selectedDay ? 'No events on this day.' : 'No events available.' }}
    </p>

    <div v-if="groupedEvents.today.length > 0" class="event-group">
      <h3 class="group-header">Today</h3>
      <ul class="events-list">
        <li v-for="event in groupedEvents.today" :key="event._key" class="event-item">
          <h4>{{ event.title }}</h4>
          <p v-if="event.time" class="event-time">{{ event.time }}</p>
          <p v-if="event.location" class="event-location">{{ event.location }}</p>
          <p v-if="event.sourceName" class="event-source">Source: {{ event.sourceName }}</p>
          <p class="event-description">{{ event.description }}</p>
        </li>
      </ul>
    </div>

    <div v-if="groupedEvents.thisWeek.length > 0" class="event-group">
      <h3 class="group-header">This Week</h3>
      <ul class="events-list">
        <li v-for="event in groupedEvents.thisWeek" :key="event._key" class="event-item">
          <h4>{{ event.title }}</h4>
          <p v-if="event.date || event.time" class="event-date">{{ event.date }} {{ event.time }}</p>
          <p v-if="event.location" class="event-location">{{ event.location }}</p>
          <p v-if="event.sourceName" class="event-source">Source: {{ event.sourceName }}</p>
          <p class="event-description">{{ event.description }}</p>
        </li>
      </ul>
    </div>

    <div v-if="groupedEvents.upcoming.length > 0" class="event-group">
      <h3 class="group-header">Upcoming</h3>
      <ul class="events-list">
        <li v-for="event in groupedEvents.upcoming" :key="event._key" class="event-item">
          <h4>{{ event.title }}</h4>
          <p v-if="event.date || event.time" class="event-date">{{ event.date }} {{ event.time }}</p>
          <p v-if="event.location" class="event-location">{{ event.location }}</p>
          <p v-if="event.sourceName" class="event-source">Source: {{ event.sourceName }}</p>
          <p class="event-description">{{ event.description }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.events-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.no-events {
  opacity: 0.6;
  font-style: italic;
  margin: 0;
}

.event-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.group-header {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.75;
}

.events-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
}

.event-item {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.875rem;
  background: var(--color-background-soft);
}

.event-item h4 {
  margin: 0 0 0.4rem;
  font-size: 1rem;
}

.event-item p {
  margin: 0;
  font-size: 0.95rem;
}

.event-time,
.event-date,
.event-location,
.event-source {
  color: var(--color-text);
  opacity: 0.8;
  margin-bottom: 0.4rem;
}

.event-description {
  margin-top: 0.4rem;
  opacity: 1;
}
</style>
