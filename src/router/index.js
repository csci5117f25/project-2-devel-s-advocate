import { createRouter, createWebHistory } from 'vue-router'
import SplashPageView from '../views/SplashPageView.vue'
import DashboardView from '../views/DashboardView.vue'
import StartSessionView from '../views/StartSessionView.vue'
import CompletedSessionView from '../views/CompletedSessionView.vue'
import AddSessionView from '../views/AddSessionView.vue'
import SessionDetailsView from '../views/SessionDetailsView.vue'
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
      path: '/start-session',
      name: 'startSession',
      component: StartSessionView,
      meta: { title: 'TraceRoute | Start Session', requiresAuth: true },
    },
    {
      path: '/completed-session/:runID',
      name: 'completedSession',
      component: CompletedSessionView,
      meta: { title: 'TraceRoute | Completed Session', requiresAuth: true },
    },
    {
      path: '/add-session',
      name: 'addSession',
      component: AddSessionView,
      meta: { title: 'TraceRoute | Add Session', requiresAuth: true },
    },
    {
      path: '/view-session/:runID',
      name: 'viewSession',
      component: SessionDetailsView,
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
