<script setup>
import EventCalendar from '../components/EventCalendar.vue'
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="max-w-6xl mx-auto px-6 py-32 text-center">
      <h1 class="text-6xl font-bold text-gray-900 mb-6 leading-tight">
        Welcome to Bayonne Portal
      </h1>
      <p class="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <button class="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition">
        Get Started
      </button>
    </section>

    <!-- Event Calendar Section -->
    <section class="max-w-6xl mx-auto px-6 py-24 border-t border-gray-200">
      <EventCalendar />
    </section>

    <!-- Features Section -->
    <section class="max-w-6xl mx-auto px-6 py-24">
      <h2 class="text-4xl font-bold text-gray-900 mb-16">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div class="space-y-4">
          <h3 class="text-2xl font-semibold text-gray-900">Simple & Clean</h3>
          <p class="text-gray-600 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit ut labore.
          </p>
        </div>
        <div class="space-y-4">
          <h3 class="text-2xl font-semibold text-gray-900">Fast & Reliable</h3>
          <p class="text-gray-600 leading-relaxed">
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div class="space-y-4">
          <h3 class="text-2xl font-semibold text-gray-900">User Friendly</h3>
          <p class="text-gray-600 leading-relaxed">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
          </p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="max-w-6xl mx-auto px-6 py-24 text-center border-t border-gray-200">
      <h2 class="text-4xl font-bold text-gray-900 mb-6">Ready to begin?</h2>
      <p class="text-lg text-gray-600 mb-12">
        Join thousands using Bayonne Portal today.
      </p>
      <button class="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition">
        Create Account
      </button>
    </section>
  </div>
</template>

<script setup>
</script>