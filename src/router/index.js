import { createRouter, createWebHistory } from 'vue-router'
import { getAuth} from 'firebase/auth'
import SplashPageView from '../views/SplashPageView.vue'
import DashboardView from '../views/DashboardView.vue'
import StartRunView from '../views/StartRunView.vue'
import CompletedRunView from '../views/CompletedRunView.vue'
import AddRunView from '../views/AddRunView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',
      name: 'splashPage',
      component: SplashPageView,
      meta: { title: 'Splash Page' }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { title: 'Dashboard' },
    },
    {
      path: '/start-run/',
      name: 'startRun',
      component: StartRunView,
      meta: { title: 'Start Run', requiresAuth: true },
    },
    {
      path: '/completed-run/:runID',
      name: 'completedRun',
      component: CompletedRunView,
      meta: { title: 'Completed Run', requiresAuth: true  },
    },
    { path: '/add-run',
      name: 'addRun',
      component: AddRunView,
      meta: { title: 'Add Run', requiresAuth: true  }
    },
    {
      path: '/:catchAll(.*)',
      name: 'notFound',
      component: NotFoundView,
      meta: { title: 'Page Not Found' },
    },
  ],
})

// Update the page title.
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Tr@ceRoute'

  if (to.meta.requiresAuth) {
    const auth = getAuth()
    const currentUser = auth.currentUser

    if (!currentUser) {
      alert('You need to log in to access this page.')
      return next({ name: 'splashPage' })
    }
  }

  next()
})

export default router
