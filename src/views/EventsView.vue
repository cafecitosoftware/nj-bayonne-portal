<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="max-w-6xl mx-auto px-6 py-32">
      <h1 class="text-6xl font-bold text-gray-900 mb-6 leading-tight">
        Upcoming Events
      </h1>
      <p class="text-xl text-gray-600 max-w-3xl leading-relaxed">
        Discover what's happening in Bayonne. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>
    </section>

    <!-- Events Grid -->
    <section class="max-w-6xl mx-auto px-6 py-24 border-t border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <!-- Event Card 1 -->
        <div class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
          <div class="w-full h-48 bg-gray-200"></div>
          <div class="p-8">
            <div class="text-sm text-gray-500 mb-3">June 15, 2026</div>
            <h3 class="text-2xl font-semibold text-gray-900 mb-3">Community Meetup</h3>
            <p class="text-gray-600 leading-relaxed mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
            </p>
            <button class="text-black font-medium hover:underline">Learn More →</button>
          </div>
        </div>

        <!-- Event Card 2 -->
        <div class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
          <div class="w-full h-48 bg-gray-200"></div>
          <div class="p-8">
            <div class="text-sm text-gray-500 mb-3">June 22, 2026</div>
            <h3 class="text-2xl font-semibold text-gray-900 mb-3">Tech Workshop</h3>
            <p class="text-gray-600 leading-relaxed mb-6">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.
            </p>
            <button class="text-black font-medium hover:underline">Learn More →</button>
          </div>
        </div>

        <!-- Event Card 3 -->
        <div class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
          <div class="w-full h-48 bg-gray-200"></div>
          <div class="p-8">
            <div class="text-sm text-gray-500 mb-3">July 5, 2026</div>
            <h3 class="text-2xl font-semibold text-gray-900 mb-3">Annual Conference</h3>
            <p class="text-gray-600 leading-relaxed mb-6">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.
            </p>
            <button class="text-black font-medium hover:underline">Learn More →</button>
          </div>
        </div>

        <!-- Event Card 4 -->
        <div class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
          <div class="w-full h-48 bg-gray-200"></div>
          <div class="p-8">
            <div class="text-sm text-gray-500 mb-3">July 20, 2026</div>
            <h3 class="text-2xl font-semibold text-gray-900 mb-3">Networking Dinner</h3>
            <p class="text-gray-600 leading-relaxed mb-6">
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.
            </p>
            <button class="text-black font-medium hover:underline">Learn More →</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Past Events Section -->
    <section class="max-w-6xl mx-auto px-6 py-24 border-t border-gray-200">
      <h2 class="text-4xl font-bold text-gray-900 mb-12">Past Events</h2>
      <div class="space-y-6">
        <div class="flex justify-between items-start pb-6 border-b border-gray-200">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Spring Celebration</h3>
            <p class="text-gray-600">May 30, 2026</p>
          </div>
          <button class="text-black font-medium hover:underline">View →</button>
        </div>
        <div class="flex justify-between items-start pb-6 border-b border-gray-200">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Developer Summit</h3>
            <p class="text-gray-600">May 15, 2026</p>
          </div>
          <button class="text-black font-medium hover:underline">View →</button>
        </div>
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Startup Pitch Night</h3>
            <p class="text-gray-600">April 28, 2026</p>
          </div>
          <button class="text-black font-medium hover:underline">View →</button>
        </div>
      </div>
    </section>

    <!-- Newsletter CTA -->
    <section class="max-w-6xl mx-auto px-6 py-24 text-center border-t border-gray-200">
      <h2 class="text-4xl font-bold text-gray-900 mb-6">Stay Updated</h2>
      <p class="text-lg text-gray-600 mb-12">
        Subscribe to get notified about upcoming events.
      </p>
      <div class="flex max-w-md mx-auto gap-3">
        <input 
          type="email" 
          placeholder="Enter your email" 
          class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
        />
        <button class="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition">
          Subscribe
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>