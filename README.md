# vue-project

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

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

### GitHub Pages Setup

For GitHub Pages deployments, the workflow reads `VITE_GA_MEASUREMENT_ID` from a repository secret.

1. Go to your repository settings in GitHub.
2. Open **Secrets and variables** > **Actions**.
3. Add a new repository secret named `VITE_GA_MEASUREMENT_ID`.
4. Add a new repository secret named `VITE_GOOGLE_MAPS_API_KEY`.
5. Set the secret values to your GA4 ID and Google Maps key.

Notes:
- Your local `.env` file is ignored by git and should stay local.
- `.env.example` is safe to commit and documents required keys.
- In Vite apps, any variable starting with `VITE_` is embedded into client code at build time.
  For GA, this is expected because a Measurement ID is not a private secret.
