<template>
  <div class="min-h-screen bg-gray-50">
    <section class="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20 px-6">
      <div class="max-w-6xl mx-auto">
        <p class="inline-flex items-center rounded-full bg-green-400 text-green-950 text-xs font-bold px-3 py-1 uppercase tracking-widest">
          Interactive Layers
        </p>
        <h1 class="text-4xl md:text-5xl font-extrabold mt-5">Bayonne Maps</h1>
        <p class="text-blue-100 text-lg mt-4 max-w-3xl">
          Browse location datasets with source filters, styled legends, and pin details.
        </p>
        <p class="mt-4 inline-flex max-w-3xl items-start rounded-lg border border-amber-300/60 bg-amber-100/95 px-4 py-2 text-sm font-medium text-amber-900">
          Map data is curated manually and may be incomplete while we continue adding and verifying locations and boundaries.
        </p>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-6 py-12">
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
        <TownMap />
      </div>
    </section>
  </div>
</template>

<script setup>
import TownMap from '../components/TownMap.vue'
</script>
