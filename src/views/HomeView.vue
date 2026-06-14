<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-28 px-6">
      <div class="max-w-5xl mx-auto text-center">
        <h1 class="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Welcome to <span class="text-yellow-300">Bayonne, NJ</span>
        </h1>
        <p class="text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
          Your one-stop hub for upcoming events and city locations in Bayonne, New Jersey.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <RouterLink
            to="/events"
            class="bg-yellow-400 text-blue-900 font-bold px-8 py-3 rounded-full hover:bg-yellow-300 transition shadow-lg text-lg"
          >
            📅 View Events
          </RouterLink>
          <RouterLink
            to="/maps"
            class="bg-blue-500 text-white font-bold px-8 py-3 rounded-full hover:bg-blue-400 transition shadow-lg text-lg"
          >
            🗺️ Explore Maps
          </RouterLink>
          <RouterLink
            to="/about"
            class="bg-white/10 border border-white/40 text-white font-bold px-8 py-3 rounded-full hover:bg-white/20 transition text-lg"
          >
            Learn More
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Stats Bar -->
    <section class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
        <div v-for="stat in cityStats" :key="stat.label" class="text-center px-4">
          <p class="text-2xl font-extrabold text-blue-900">{{ stat.value }}</p>
          <p class="text-gray-500 text-sm mt-1">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- Quick Access Section -->
    <section class="max-w-6xl mx-auto px-6 py-16">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-gray-900">Explore Bayonne</h2>
        <p class="text-gray-500 mt-2">Choose a section to browse events and map resources.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RouterLink
          to="/events"
          class="group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
        >
          <p class="text-sm font-semibold uppercase tracking-wide text-blue-600">Events</p>
          <h3 class="text-2xl font-bold text-gray-900 mt-2">Community Calendar</h3>
          <p class="text-gray-500 mt-2">Browse upcoming activities from libraries, schools, and City of Bayonne event feeds.</p>
          <p class="text-blue-700 font-semibold mt-5 group-hover:underline">Open Events Page →</p>
        </RouterLink>
        <RouterLink
          to="/maps"
          class="group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
        >
          <p class="text-sm font-semibold uppercase tracking-wide text-green-600">Maps</p>
          <h3 class="text-2xl font-bold text-gray-900 mt-2">City Data Map</h3>
          <p class="text-gray-500 mt-2">View map pins by source with filters, legend controls, and location details.</p>
          <p class="text-blue-700 font-semibold mt-5 group-hover:underline">Open Maps Page →</p>
        </RouterLink>
      </div>
    </section>

    <!-- City Services Section -->
    <section class="bg-white border-t border-gray-100 py-16 px-6">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 mb-2 text-center">Data Sources</h2>
        <p class="text-gray-500 text-center mb-10">All the sources of data that power this city portal.</p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div
            v-for="service in services"
            :key="service.title"
            class="flex flex-col items-center text-center bg-gray-50 border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          >
            <span class="text-4xl mb-3">{{ service.icon }}</span>
            <h3 class="font-semibold text-gray-800 text-sm">{{ service.title }}</h3>
            <p class="text-gray-400 text-xs mt-1">{{ service.description }}</p>
            <a :href="service.url" target="_blank" rel="noopener noreferrer" class="text-blue-500 text-xs mt-2 hover:underline">
              Visit Site
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Banner -->   

  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { withCampaignParams } from '@/utils/outboundLinks'

const cityStats = [
  { value: '72K+', label: 'Residents' },
  { value: '1861', label: 'Founded' },
  { value: '5.9 mi²', label: 'City Area' },
  { value: '21', label: 'Neighborhoods' },
]

const services = [
  { icon: '📚', title: 'Public Library', description: 'Public Library Services', url: withCampaignParams('https://www.bayonnelibrary.org/') },
  { icon: '🏫', title: 'School District', description: 'Public School Services', url: withCampaignParams('https://www.bboed.org/') },
  { icon: '🏛️', title: 'City of Bayonne', description: 'City of Bayonne', url: withCampaignParams('https://www.bayonnenj.org') }
]

</script>