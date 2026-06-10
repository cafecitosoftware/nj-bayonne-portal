<template>
  <div class="min-h-screen flex flex-col bg-gray-50">

    <!-- Navigation -->
    <header class="bg-blue-900 shadow-lg sticky top-0 z-50">
      <nav class="max-w-6xl mx-auto px-6 py-0 flex items-center justify-between h-16">
        <!-- Brand -->
        <RouterLink to="/" class="flex items-center gap-2 text-white font-extrabold text-lg tracking-wide hover:text-yellow-300 transition">
          🏙️ City of Bayonne
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
          <h3 class="text-white font-semibold text-lg mb-3">City of Bayonne</h3>
          <p class="text-sm leading-relaxed">
            630 Avenue C<br />
            Bayonne, NJ 07002<br />
            (201) 858-6000
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
          <h3 class="text-white font-semibold text-lg mb-3">Office Hours</h3>
          <p class="text-sm leading-relaxed">Mon – Fri: 8:30 AM – 4:30 PM</p>
          <p class="text-sm mt-2">info@bayonnenj.gov</p>
        </div>
      </div>
      <div class="border-t border-blue-700 py-4 text-center text-xs text-blue-400">
        © {{ new Date().getFullYear() }} City of Bayonne, NJ. All rights reserved.
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const mobileOpen = ref(false)

const navLinks = [
  { path: '/', label: '🏠 Home' },
  { path: '/events', label: '📅 Events' },
  { path: '/about', label: 'ℹ️ About' },
]
</script>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
</style>