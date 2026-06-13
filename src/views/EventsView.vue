<template>
  <div class="min-h-screen bg-gray-50">
    <section class="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20 px-6">
      <div class="max-w-6xl mx-auto">
        <p class="inline-flex items-center rounded-full bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 uppercase tracking-widest">
          Community Events
        </p>
        <h1 class="text-4xl md:text-5xl font-extrabold mt-5">Bayonne Events</h1>
        <p class="text-blue-100 text-lg mt-4 max-w-3xl">
          Discover local events from trusted community sources and filter by organization.
        </p>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-6 py-12">
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
        <EventCalendar />
      </div>
    </section>
  </div>
</template>

<script setup>
import EventCalendar from '../components/EventCalendar.vue'
</script>
