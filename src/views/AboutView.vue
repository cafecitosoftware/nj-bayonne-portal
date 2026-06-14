<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Hero -->
    <div class="bg-blue-900 text-white py-16 px-6">
      <div class="max-w-4xl mx-auto">
        <span class="inline-block bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full mb-5 uppercase tracking-widest">
          ☕ Built by Cafecito Software
        </span>
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          About This Project
        </h1>
        <p class="text-blue-200 text-lg max-w-2xl leading-relaxed">
          A community portal built by one person who landed in Bayonne and loves this city.
        </p>
      </div>
    </div>

    <!-- Disclaimer Banner -->
    <div class="bg-yellow-50 border-y border-yellow-200 px-6 py-4">
      <div class="max-w-4xl mx-auto flex items-start gap-3">
        <span class="text-yellow-600 text-xl mt-0.5">⚠️</span>
        <p class="text-yellow-800 text-sm leading-relaxed">
          <strong>Disclaimer:</strong> This website is an independent community resource built by Cafecito Software and is
          <strong>not affiliated with, endorsed by, or associated with the City of Bayonne</strong>
          or any official government body. Information here is provided as-is for community convenience. Usage insights may be added in the future to improve the experience.
        </p>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-6 py-16 space-y-16">

      <!-- The Story -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 class="text-3xl font-bold text-gray-900 mb-5">Why I Built This</h2>
          <p class="text-gray-600 leading-relaxed mb-4">
            Like a lot of people, I made a choice to step back from social media. No more endless scrolling,
            no more noise — just a quieter, more intentional way of living.
          </p>
          <p class="text-gray-600 leading-relaxed mb-4">
            But that came with a trade-off: <strong>I had no easy way to find out what was happening in my own town.</strong>
            Want to know if there's a community event this weekend? Good luck — it was buried in a Facebook group
            or a flyer stapled to a telephone pole.
          </p>
          <p class="text-gray-600 leading-relaxed">
            So I built this. A simple, clean place where anyone in Bayonne can see what's going on — no account
            required, no algorithm, no ads. Just your city's events, in one place.
          </p>
          <p class="text-gray-600 leading-relaxed mt-4">
            I was not born and raised in Bayonne. It is the city I landed in and came to love, and this portal is one way I can give back.
          </p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="card in storyCards" :key="card.label"
            class="bg-white rounded-2xl border border-gray-200 p-5 text-center shadow-sm"
          >
            <div class="text-3xl mb-2">{{ card.icon }}</div>
            <p class="font-semibold text-gray-800 text-sm">{{ card.label }}</p>
            <p class="text-gray-400 text-xs mt-1">{{ card.sub }}</p>
          </div>
        </div>
      </section>

      <!-- About Cafecito Software -->
      <section class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="bg-blue-900 px-8 py-6">
          <h2 class="text-2xl font-bold text-white">☕ Cafecito Software</h2>
          <p class="text-blue-200 text-sm mt-1">Independent software. Built with care.</p>
        </div>
        <div class="px-8 py-8">
          <p class="text-gray-600 leading-relaxed mb-4">
            Cafecito Software is a one-person independent software company focused on building useful tools
            for real people, and maybe even a video game. No venture capital, no growth hacking — just thoughtful
            software made by someone who lives in the same community it serves.
          </p>
          <p class="text-gray-600 leading-relaxed">
            This portal is our way of giving back to Bayonne — the city we call home. We hope it makes
            it a little easier for residents to stay connected with what's happening around them,
            on their own terms.
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <span v-for="tag in techTags" :key="tag"
              class="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </section>

      <!-- Technology Behind This -->
      <section>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Technology Behind This</h2>
        <p class="text-gray-500 mb-8">Open, modern tools — no heavy frameworks, no unnecessary complexity.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="tech in techStack" :key="tech.name"
            class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-start gap-4"
          >
            <span class="text-3xl">{{ tech.icon }}</span>
            <div>
              <h3 class="font-bold text-gray-800 mb-1">{{ tech.name }}</h3>
              <p class="text-gray-500 text-sm leading-relaxed">{{ tech.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Values -->
      <section>
        <h2 class="text-3xl font-bold text-gray-900 mb-8">What We Stand For</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div v-for="value in values" :key="value.title"
            class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-4"
          >
            <span class="text-3xl">{{ value.icon }}</span>
            <div>
              <h3 class="font-bold text-gray-800 mb-1">{{ value.title }}</h3>
              <p class="text-gray-500 text-sm leading-relaxed">{{ value.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Support -->
      <section class="bg-blue-900 rounded-2xl px-8 py-10 text-center">
        <div class="text-4xl mb-4">⭐</div>
        <h2 class="text-2xl font-bold text-white mb-2">Support This Project</h2>
        <p class="text-blue-200 mb-6 max-w-xl mx-auto leading-relaxed">
          If this portal has been helpful, consider starring the project on GitHub or following Cafecito Software — it means a lot and helps others discover it.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a href="https://github.com/cafecitosoftware/nj-bayonne-portal" target="_blank" rel="noopener noreferrer"
            class="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 font-bold px-5 py-2.5 rounded-full text-sm hover:bg-yellow-300 transition-colors"
          >
            ⭐ Star on GitHub
          </a>
          <a href="https://github.com/cafecitosoftware" target="_blank" rel="noopener noreferrer"
            class="inline-flex items-center gap-2 bg-white text-blue-900 font-bold px-5 py-2.5 rounded-full text-sm hover:bg-blue-50 transition-colors"
          >
            ☕ Follow @cafecitosoftware
          </a>
          <a href="https://github.com/bertcafecito" target="_blank" rel="noopener noreferrer"
            class="inline-flex items-center gap-2 bg-white text-blue-900 font-bold px-5 py-2.5 rounded-full text-sm hover:bg-blue-50 transition-colors"
          >
            👤 Follow @bertcafecito
          </a>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
const storyCards = [
  { icon: '📵', label: 'Off Social Media', sub: 'By choice' },
  { icon: '🏙️', label: 'Bayonne Resident', sub: 'Landed here, love it' },
  { icon: '☕', label: 'Cafecito Software', sub: 'Company of one' },
  { icon: '💙', label: 'Community First', sub: 'Always free' },
]

const techTags = ['Vue 3', 'Vite', 'Tailwind CSS', 'FullCalendar', 'Google Maps', 'Vue Router']

const techStack = [
  {
    icon: '💚',
    name: 'Vue 3',
    description: 'Progressive JavaScript framework powering the UI with reactive components and the Composition API.',
  },
  {
    icon: '⚡',
    name: 'Vite',
    description: 'Lightning-fast build tool and dev server. Near-instant hot reloads during development.',
  },
  {
    icon: '🎨',
    name: 'Tailwind CSS',
    description: 'Utility-first CSS framework that makes styling fast, consistent, and fully responsive.',
  },
  {
    icon: '📅',
    name: 'FullCalendar',
    description: 'Full-featured calendar library rendering community events in an interactive monthly view.',
  },
  {
    icon: '🗺️',
    name: 'Google Maps',
    description: 'Interactive maps powered by vue3-google-map, used to display parks, splash pads, and points of interest.',
  },
  {
    icon: '🔀',
    name: 'Vue Router',
    description: 'Official router for Vue 3, enabling seamless client-side navigation between pages.',
  },
  {
    icon: '📈',
    name: 'Vue Gtag',
    description: 'Google Analytics integration to understand how residents use the portal and improve the experience.',
  },
]

const values = [
  {
    icon: '🔓',
    title: 'No Login Required',
    description: 'Everything on this site is freely accessible. No account and no sign-up required.',
  },
  {
    icon: '📵',
    title: 'Social Media Free',
    description: 'You shouldn\'t need a Facebook account to know what\'s happening in your own neighborhood.',
  },
  {
    icon: '🤝',
    title: 'Community Driven',
    description: 'Built by a resident, for residents. No corporate interest, no agenda.',
  },
  {
    icon: '📊',
    title: 'Built To Improve',
    description: 'Usage insights may be used in the future to better understand what helps residents most.',
  },
  {
    icon: '🏙️',
    title: 'Proudly from Bayonne',
    description: 'This is our city. We\'re proud of it, and this is our small way of showing that.',
  },
]
</script>