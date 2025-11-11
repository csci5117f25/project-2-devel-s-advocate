import { createRouter, createWebHistory } from 'vue-router'

import SplashPageView from '../views/SplashPageView.vue'
import DashboardView from '../views/DashboardView.vue'
import StartRunView from '../views/StartRunView.vue'
import CompletedRunView from '../views/CompletedRunView.vue'
import AddRunView from '../views/AddRunView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'splashPage', component: SplashPageView, meta: { title: 'Splash Page' } },
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
      meta: { title: 'Start Run' },
    },
    {
      path: '/completed-run/:id',
      name: 'completedRun',
      component: CompletedRunView,
      meta: { title: 'Completed Run' },
    },
    { path: '/add-run', name: 'addRun', component: AddRunView, meta: { title: 'Add Run' } },
    { path: '/404', name: 'notFound', component: NotFoundView, meta: { title: '404 Not Found' } },
  ],
})

// Update the page title.
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Homework 2 App'
  next()
})

export default router
