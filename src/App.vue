<template>
  <header class="border-b border-gray-200 sticky top-0 bg-white">
    <nav class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
      <RouterLink to="/" class="text-xl font-semibold text-gray-900">
        Bayonne
      </RouterLink>
      <ul class="flex gap-8 list-none">
        <li><RouterLink to="/" class="text-gray-600 hover:text-gray-900 transition text-sm">Home</RouterLink></li>
        <li><RouterLink to="/events" class="text-gray-600 hover:text-gray-900 transition text-sm">Events</RouterLink></li>
        <li><RouterLink to="/about" class="text-gray-600 hover:text-gray-900 transition text-sm">About</RouterLink></li>
      </ul>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>

  <footer class="border-t border-gray-200 mt-24">
    <div class="max-w-6xl mx-auto px-6 py-8 text-center text-gray-600 text-sm">
      <p>&copy; 2026 Bayonne Portal. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
</style>