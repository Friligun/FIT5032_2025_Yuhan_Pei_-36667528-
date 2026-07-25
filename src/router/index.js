import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ResourcesView from '../views/ResourcesView.vue'
import RateServiceView from '../views/RateServiceView.vue'
import LoginView from '../views/LoginView.vue'
import MyAccountView from '../views/MyAccountView.vue'
import AdminView from '../views/AdminView.vue'
import AboutView from '../views/AboutView.vue'
import { getCurrentUser } from '../stores/auth'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/resources', name: 'Resources', component: ResourcesView },
  { path: '/community/rate', name: 'RateService', component: RateServiceView },
  { path: '/login', name: 'Login', component: LoginView },
  {
    path: '/account',
    name: 'MyAccount',
    component: MyAccountView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAuth: true, requiresRole: 'admin' }
  },
  { path: '/about', name: 'About', component: AboutView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const user = getCurrentUser()

  if (to.meta.requiresAuth && !user) {
    next({ name: 'Login' })
  } else if (to.meta.requiresRole && (!user || user.role !== to.meta.requiresRole)) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
