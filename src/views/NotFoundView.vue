<template>
  <section class="min-h-[calc(100vh-8rem)] bg-slate-50 px-6 py-10 md:py-14">
    <div class="mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-2 md:items-center">
      <div>
        <p class="text-sm font-semibold uppercase tracking-wide text-blue-700">Error 404</p>
        <h1 class="mt-2 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
          This page took a wrong turn near the bridge.
        </h1>
        <p class="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
          The page you requested does not exist. You can jump back to the Bayonne Portal home page or explore current events and maps.
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <RouterLink
            to="/"
            class="rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Go Home
          </RouterLink>
          <RouterLink
            to="/events"
            class="rounded-full border border-blue-200 bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            View Events
          </RouterLink>
          <RouterLink
            to="/maps"
            class="rounded-full border border-blue-200 bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Open Maps
          </RouterLink>
        </div>
      </div>

      <figure class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Bayonne_Bridge.jpg/1280px-Bayonne_Bridge.jpg"
          alt="Bayonne Bridge in New Jersey"
          class="h-full max-h-[500px] w-full object-cover"
          loading="lazy"
        />
        <figcaption class="px-4 py-3 text-xs leading-relaxed text-slate-500">
          Photo: "Bayonne Bridge" by Gould363,
          <a
            href="https://commons.wikimedia.org/wiki/File:Bayonne_Bridge.jpg"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-800"
          >
            Wikimedia Commons
          </a>
          , licensed under
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-800"
          >
            CC BY-SA 4.0
          </a>
          (commercial use allowed with attribution).
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
