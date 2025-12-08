import './assets/css/base.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

/* Import code for Font Awesome was found here:
      https://docs.fontawesome.com/web/use-with/vue/add-icons */

/* Import the Font Awesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* Import Font Awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* Import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './firebaseApp.js'

library.add(fas, far, fab)

const app = createApp(App)

app.use(router)

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)


app.use(VueFire, {
  firebaseApp,
  modules: [
    VueFireAuth()
  ]
})

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
