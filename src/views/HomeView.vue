<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-28 px-6">
      <div class="max-w-5xl mx-auto text-center">
        <span class="inline-block bg-yellow-400 text-blue-900 text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
          🏙️ Official City Portal
        </span>
        <h1 class="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Welcome to <span class="text-yellow-300">Bayonne</span>
        </h1>
        <p class="text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
          Your one-stop hub for city news, upcoming events, and community resources in Bayonne, New Jersey.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <RouterLink
            to="/events"
            class="bg-yellow-400 text-blue-900 font-bold px-8 py-3 rounded-full hover:bg-yellow-300 transition shadow-lg text-lg"
          >
            📅 View Events
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

    <!-- Event Calendar Section -->
    <section class="max-w-6xl mx-auto px-6 py-16">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-3xl font-bold text-gray-900">Upcoming Events</h2>
          <p class="text-gray-500 mt-1">Stay informed about what's happening in the city.</p>
        </div>
        <RouterLink
          to="/events"
          class="hidden sm:inline-block text-blue-700 font-semibold hover:underline text-sm"
        >
          View All →
        </RouterLink>
      </div>
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <EventCalendar />
      </div>
    </section>

    <!-- City Services Section -->
    <section class="bg-white border-t border-gray-100 py-16 px-6">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 mb-2 text-center">City Services</h2>
        <p class="text-gray-500 text-center mb-10">Everything you need, all in one place.</p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div
            v-for="service in services"
            :key="service.title"
            class="flex flex-col items-center text-center bg-gray-50 border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          >
            <span class="text-4xl mb-3">{{ service.icon }}</span>
            <h3 class="font-semibold text-gray-800 text-sm">{{ service.title }}</h3>
            <p class="text-gray-400 text-xs mt-1">{{ service.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest News Section -->
    <section class="max-w-6xl mx-auto px-6 py-16">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Latest News</h2>
      <p class="text-gray-500 mb-10">Stay up to date with what's happening in Bayonne.</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article
          v-for="news in newsItems"
          :key="news.title"
          class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
        >
          <div :class="`h-2 ${news.color}`"></div>
          <div class="p-6">
            <span :class="`text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${news.badgeColor}`">
              {{ news.category }}
            </span>
            <h3 class="font-bold text-gray-800 text-base mt-3 mb-2">{{ news.title }}</h3>
            <p class="text-gray-500 text-sm leading-relaxed">{{ news.excerpt }}</p>
            <p class="text-xs text-gray-400 mt-4">{{ news.date }}</p>
          </div>
        </article>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="bg-blue-900 py-16 px-6 text-center text-white">
      <h2 class="text-3xl font-bold mb-4">Stay Connected with Your City</h2>
      <p class="text-blue-200 mb-8 max-w-xl mx-auto">
        Sign up for alerts, follow us on social media, or visit City Hall for in-person assistance.
      </p>
      <a
        href="mailto:info@bayonnenj.gov"
        class="inline-block bg-yellow-400 text-blue-900 font-bold px-8 py-3 rounded-full hover:bg-yellow-300 transition shadow-lg text-lg"
      >
        📧 Contact City Hall
      </a>
    </section>

  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import EventCalendar from '../components/EventCalendar.vue'

const cityStats = [
  { value: '72K+', label: 'Residents' },
  { value: '1861', label: 'Founded' },
  { value: '5.9 mi²', label: 'City Area' },
  { value: '21', label: 'Neighborhoods' },
]

const services = [
  { icon: '🏛️', title: 'City Hall', description: 'Permits & licenses' },
  { icon: '🚒', title: 'Public Safety', description: 'Police & fire' },
  { icon: '🗑️', title: 'Public Works', description: 'Trash & roads' },
  { icon: '📚', title: 'Library', description: 'Books & programs' },
  { icon: '🌳', title: 'Parks & Rec', description: 'Parks & sports' },
  { icon: '🏫', title: 'Education', description: 'Schools & resources' },
  { icon: '🚌', title: 'Transit', description: 'Bus & transit info' },
  { icon: '💼', title: 'Business', description: 'Local business support' },
]

const newsItems = [
  {
    title: 'Summer Road Improvement Projects Begin',
    category: 'Public Works',
    excerpt: 'Scheduled road resurfacing along Avenue C and Broadway starts next week.',
    date: 'June 5, 2026',
    color: 'bg-blue-500',
    badgeColor: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'New Community Park Opening Ceremony',
    category: 'Parks & Rec',
    excerpt: 'Join us for the grand opening of the renovated Hudson Park waterfront this Saturday.',
    date: 'June 3, 2026',
    color: 'bg-green-500',
    badgeColor: 'bg-green-50 text-green-600',
  },
  {
    title: 'City Budget Meeting Schedule Released',
    category: 'City Hall',
    excerpt: 'Public meetings for the 2026–2027 fiscal year budget review are now scheduled.',
    date: 'May 28, 2026',
    color: 'bg-yellow-400',
    badgeColor: 'bg-yellow-50 text-yellow-600',
  },
]
</script>