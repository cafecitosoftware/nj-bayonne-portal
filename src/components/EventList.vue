<script setup>
import { useEventSources } from '@/composables/useEventSources'

const { events, loading, error, reload } = useEventSources()
</script>

<template>
  <div class="events min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Loading State -->
      <p v-if="loading" class="text-center text-gray-600 text-lg">
        Loading events...
      </p>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-800 mb-3">{{ error }}</p>
        <button
          type="button"
          @click="reload"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium"
        >
          Try again
        </button>
      </div>

      <!-- Events Count -->
      <h2 v-if="!loading && !error" class="text-2xl font-bold text-gray-900 mb-6">
        {{ events.length }} event{{ events.length !== 1 ? 's' : '' }} found
      </h2>

      <!-- Events List -->
      <section v-if="!loading && !error && events.length > 0">
        <ul class="space-y-4">
          <li
            v-for="event in events"
            :key="event.id"
            class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              {{ event.title }}
            </h3>
            <p class="text-gray-600 mb-4">{{ event.description }}</p>
            <div class="flex flex-col sm:flex-row sm:gap-6 text-sm text-gray-700">
              <p><strong class="font-medium">Date:</strong> {{ event.date }}</p>
              <p><strong class="font-medium">Location:</strong> {{ event.location }}</p>
            </div>
          </li>
        </ul>
      </section>

      <!-- Empty State -->
      <div v-if="!loading && !error && events.length === 0" class="text-center py-12">
        <p class="text-gray-500 text-lg">No events found.</p>
      </div>
    </div>
  </div>
</template>