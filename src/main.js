import './assets/main.css'

import { createApp } from 'vue'
import { createGtag } from 'vue-gtag'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID

if (gaMeasurementId) {
	app.use(createGtag({
		tagId: gaMeasurementId,
		pageTracker: {
			router,
		},
	}))
}

app.use(router)

app.mount('#app')
