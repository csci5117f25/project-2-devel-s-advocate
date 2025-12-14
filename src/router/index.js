import { createRouter, createWebHistory } from 'vue-router'
import SplashPageView from '../views/SplashPageView.vue'
import DashboardView from '../views/DashboardView.vue'
import StartRunView from '../views/StartRunView.vue'
import CompletedRunView from '../views/CompletedRunView.vue'
import AddRunView from '../views/AddRunView.vue'
import SessionInfoView from '../views/SessionInfoView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'splashPage',
      component: SplashPageView,
      beforeEnter: async () => {
        const { getCurrentUser } = await import('vuefire')
        const user = await getCurrentUser()
        if (user) return { name: 'dashboard' }
      },
      meta: { title: 'TraceRoute' },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { title: 'TraceRoute | Dashboard', requiresAuth: true },
    },
    {
      path: '/start-run',
      name: 'startRun',
      component: StartRunView,
      meta: { title: 'TraceRoute | Start Session', requiresAuth: true },
    },
    {
      path: '/completed-run/:runID',
      name: 'completedRun',
      component: CompletedRunView,
      meta: { title: 'TraceRoute | Completed Session', requiresAuth: true },
    },
    {
      path: '/add-run',
      name: 'addRun',
      component: AddRunView,
      meta: { title: 'TraceRoute | Add Session', requiresAuth: true },
    },
    {
      path: '/view-session/:runID',
      name: 'viewSession',
      component: SessionInfoView,
      meta: { title: 'TraceRoute | Session Details', requiresAuth: true },
    },
    {
      path: '/:catchAll(.*)',
      name: 'notFound',
      component: NotFoundView,
      meta: { title: 'TraceRoute | Page Not Found' },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title || 'Tr@ceRoute'

  const { getCurrentUser } = await import('vuefire')
  const user = await getCurrentUser()

  if (to.meta.requiresAuth && !user) {
    alert('You need to log in to access this page.')
    return next({ name: 'splashPage' })
  }

  next()
})
export default router
