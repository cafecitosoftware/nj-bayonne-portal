<template>
  <div class="min-h-screen flex flex-col bg-gray-50">

    <!-- Navigation -->
    <header class="bg-blue-900 shadow-lg sticky top-0 z-50">
      <nav class="max-w-6xl mx-auto px-6 py-0 flex items-center justify-between h-16">
        <!-- Brand -->
        <RouterLink to="/" class="flex items-center gap-2 hover:opacity-90 transition">
          <span class="text-white font-extrabold text-lg tracking-wide hover:text-yellow-300 transition">🏙️ Bayonne Portal</span>
          <span class="hidden sm:inline-block bg-yellow-400 text-blue-900 text-xs font-bold px-2 py-0.5 rounded-full">Community</span>
        </RouterLink>

        <!-- Desktop Links -->
        <ul class="hidden md:flex items-center gap-1 list-none">
          <li v-for="link in navLinks" :key="link.path">
            <RouterLink
              :to="link.path"
              class="text-blue-100 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              active-class="bg-blue-700 text-white"
            >
              {{ link.label }}
            </RouterLink>
          </li>
        </ul>

        <!-- Mobile Menu Button -->
        <button
          @click="mobileOpen = !mobileOpen"
          class="md:hidden text-blue-100 hover:text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </nav>

      <!-- Mobile Dropdown -->
      <div v-if="mobileOpen" class="md:hidden bg-blue-800 px-6 pb-4 pt-2 space-y-1">
        <RouterLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          @click="mobileOpen = false"
          class="block text-blue-100 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
          active-class="bg-blue-700 text-white"
        >
          {{ link.label }}
        </RouterLink>
      </div>
    </header>

    <!-- Page Content -->
    <main class="flex-1">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="bg-blue-900 text-blue-200">
      <div class="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-white font-semibold text-lg mb-3">☕ Cafecito Software</h3>
          <p class="text-sm leading-relaxed">
            A one-person independent software studio building useful tools for real people.
            This project is community-focused and not affiliated with the City of Bayonne.
          </p>
        </div>
        <div>
          <h3 class="text-white font-semibold text-lg mb-3">Quick Links</h3>
          <ul class="space-y-1 text-sm list-none">
            <li v-for="link in navLinks" :key="link.path">
              <RouterLink :to="link.path" class="hover:text-white transition">{{ link.label }}</RouterLink>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-white font-semibold text-lg mb-3">City of Bayonne</h3>
          <p class="text-sm leading-relaxed">
            630 Avenue C, Bayonne, NJ 07002<br />
            (201) 858-6000
          </p>
          <a :href="cityWebsiteUrl" target="_blank" rel="noopener noreferrer"
            class="inline-block mt-2 text-xs text-yellow-400 hover:text-yellow-300 transition"
          >
            Official City Website →
          </a>
        </div>
      </div>
      <div class="border-t border-blue-700 py-4 px-6">
        <div class="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-blue-400">
          <p>© {{ new Date().getFullYear() }} Cafecito Software. Built with ☕ in Bayonne, NJ.</p>
          <p class="text-center">Independent project. Not affiliated with or endorsed by the City of Bayonne.</p>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { withCampaignParams } from '@/utils/outboundLinks'

const mobileOpen = ref(false)
const cityWebsiteUrl = withCampaignParams('https://www.bayonnenj.org')

const navLinks = [
  { path: '/', label: '🏠 Home' },
  { path: '/events', label: '📅 Events' },
  { path: '/maps', label: '🗺️ Maps' },
  { path: '/about', label: 'ℹ️ About' },
]
</script>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
</style>