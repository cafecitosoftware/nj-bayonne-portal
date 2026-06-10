<script setup>
import { useEventSources } from '@/composables/useEventSources'

const { events, loading, error, reload } = useEventSources()
</script>

<template>
   <div class="events">
    <p v-if="loading">Loading events...</p>
    <p v-else-if="error" class="error">
      {{ error }}
      <button type="button" class="retry" @click="reload">Try again</button>
    </p>
    <p v-if="!loading && !error">
      {{ events.length }} event{{ events.length !== 1 ? 's' : '' }} found.
    </p>
    <section v-if="!loading && !error">
      <ul>
        <li v-for="event in events" :key="event.id">
          <h3>{{ event.title }}</h3>
          <p>{{ event.description }}</p>
          <p><strong>Date:</strong> {{ event.date }}</p>
          <p><strong>Location:</strong> {{ event.location }}</p>
        </li>
      </ul>
    </section>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .events {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
