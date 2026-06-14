# Bayonne Community Portal

![Vue 3](https://img.shields.io/badge/Vue-3-42b883?logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white)
![FullCalendar](https://img.shields.io/badge/FullCalendar-6-4a90d9?logo=googlecalendar&logoColor=white)
![Google Maps](https://img.shields.io/badge/Google_Maps-vue3--google--map-4285F4?logo=googlemaps&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

A community portal for Bayonne, NJ — built by one person who landed here and loves this city. Find local events, explore parks and splash pads on a map, and stay connected with your neighborhood — no social media account required.

> **Disclaimer:** This is an independent community resource built by Cafecito Software and is **not affiliated with, endorsed by, or associated with the City of Bayonne** or any official government body.

## Tech Stack

| Technology | Purpose |
|---|---|
| [Vue 3](https://vuejs.org/) | UI framework — reactive components, Composition API |
| [Vite](https://vite.dev/) | Build tool and dev server |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS styling |
| [FullCalendar](https://fullcalendar.io/) | Interactive event calendar |
| [vue3-google-map](https://vue3-google-map.com/) | Google Maps integration for parks and points of interest |
| [Vue Router](https://router.vuejs.org/) | Client-side routing |
| [vue-gtag](https://github.com/MatteoGabriele/vue-gtag) | Google Analytics 4 integration |

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

## Customize Configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Google Analytics (vue-gtag)

This project includes a basic Google Analytics 4 setup via `vue-gtag`.

1. Create your local environment file from `.env.example`.
2. Set `VITE_GA_MEASUREMENT_ID` to your GA4 Measurement ID (for example `G-XXXXXXXXXX`).
3. Set `VITE_GOOGLE_MAPS_API_KEY` to your Google Maps JavaScript API key.

When the env var is present, analytics is initialized automatically and route changes are tracked through Vue Router.

Notes:
- Your local `.env` file is ignored by git and should stay local.
- `.env.example` is safe to commit and documents required keys.
- In Vite apps, any variable starting with `VITE_` is embedded into client code at build time.
  For GA, this is expected because a Measurement ID is not a private secret.

## Support

If you find this project useful, here are a few ways to show your support:

- ⭐ **Star this repository** — it helps others discover the project
- 👤 **Follow [@cafecitosoftware](https://github.com/cafecitosoftware)** on GitHub
- 👤 **Follow [@bertcafecito](https://github.com/bertcafecito)** on GitHub

Built with ☕ by [Cafecito Software](https://github.com/cafecitosoftware) — independent software, built with care.
