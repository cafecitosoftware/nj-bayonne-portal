<script setup>
import { ref, computed } from 'vue'
import EventCalendar from '../components/EventCalendar.vue'
import EventList from '../components/EventList.vue'
import { useEventSources } from '../composables/useEventSources'

const { events, loading, error, reload, loadedSources } = useEventSources()

const selectedDay = ref(null)

function deriveStableKey(event, index) {
  if (event.id) return event.id
  const composite = `${event.title || 'event'}-${event.date || 'nodate'}-${event.time || 'notime'}-${event.location || 'noloc'}`
  return `derived-${composite.replace(/[^a-z0-9_-]/gi, '_').toLowerCase()}-${index}`
}

const eventsWithKeys = computed(() => {
  return events.value.map((event, index) => ({
    ...event,
    _key: deriveStableKey(event, index),
  }))
})
</script>

<template>
  <main class="events">
    <h1>Events</h1>
    <p v-if="loading">Loading events...</p>
    <p v-else-if="error" class="error">
      {{ error }}
      <button type="button" class="retry" @click="reload">Try again</button>
    </p>

    <p v-if="!loading && !error" class="meta">
      Loaded {{ loadedSources.length }} source{{ loadedSources.length === 1 ? '' : 's' }}.
    </p>

    <p v-if="!loading && !error && events.length === 0">No events available.</p>

    <section v-if="!loading && !error" class="events-layout">
      <EventCalendar :events="events" @select="selectedDay = $event" />
      <EventList :events="eventsWithKeys" :selected-day="selectedDay" />
    </section>
  </main>
</template>

<style scoped>
.events {
  padding: 2rem 1rem;
}

.meta {
  margin: 0.75rem 0 0;
}

.error {
  color: #b42318;
  margin: 0.75rem 0 0;
}

.retry {
  margin-left: 0.75rem;
}

.events-layout {
  margin-top: 1rem;
  display: grid;
  gap: 1rem;
}

@media (min-width: 1024px) {
  .events-layout {
    grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
    align-items: start;
  }
}
</style>
