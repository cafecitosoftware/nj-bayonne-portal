import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const BASE_SITE_URL = 'https://nj-bayonne-portal.cafecitosoftware.com'
const DEFAULT_TITLE = 'Bayonne Portal | Events and Maps in Bayonne, NJ'
const DEFAULT_DESCRIPTION = 'Bayonne Portal by Cafecito Software: discover local events, community resources, and interactive maps for Bayonne, New Jersey.'

function ensureMeta(nameOrProperty, content, useProperty = false) {
  const selector = useProperty
    ? `meta[property="${nameOrProperty}"]`
    : `meta[name="${nameOrProperty}"]`

  let tag = document.head.querySelector(selector)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(useProperty ? 'property' : 'name', nameOrProperty)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function ensureCanonical(url) {
  let tag = document.head.querySelector('link[rel="canonical"]')
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', 'canonical')
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', url)
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      return {
        el: to.hash,
        top: 80,
        behavior: 'auto'
      }
    }

    return { top: 0, left: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Bayonne Portal | Events and Maps in Bayonne, NJ',
        description: 'Explore Bayonne events and maps in one place with this independent community portal by Cafecito Software.'
      }
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('../views/EventsView.vue'),
      meta: {
        title: 'Bayonne Events | Bayonne Portal',
        description: 'Find upcoming local events in Bayonne, NJ from city and community sources.'
      }
    },
    {
      path: '/maps',
      name: 'maps',
      component: () => import('../views/MapsView.vue'),
      meta: {
        title: 'Bayonne Maps | Bayonne Portal',
        description: 'View parks, splash pads, and community maps across Bayonne, New Jersey.'
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: 'About Bayonne Portal | Cafecito Software',
        description: 'Learn about the Bayonne Portal project, data sources, and its independent community focus.'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: {
        title: 'Page Not Found | Bayonne Portal',
        description: 'The page you requested could not be found. Return to Bayonne Portal events and maps.'
      }
    }
  ],
})

router.afterEach((to) => {
  const title = to.meta?.title || DEFAULT_TITLE
  const description = to.meta?.description || DEFAULT_DESCRIPTION
  const path = to.fullPath || '/'
  const pageUrl = new URL(path, `${BASE_SITE_URL}/`).toString()

  document.title = title
  ensureMeta('description', description)
  ensureMeta('og:title', title, true)
  ensureMeta('og:description', description, true)
  ensureMeta('og:url', pageUrl, true)
  ensureMeta('twitter:title', title)
  ensureMeta('twitter:description', description)
  ensureCanonical(pageUrl)
})

export default router
