import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { guest: true },
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('@/views/auth/ForgotPasswordView.vue'),
      meta: { guest: true },
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: 'assistant',
          name: 'Assistant',
          component: () => import('@/views/AssistantView.vue'),
        },
        {
          path: 'detect/transaction',
          name: 'DetectTransaction',
          component: () => import('@/views/detect/TransactionDetect.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'detect/content',
          name: 'DetectContent',
          component: () => import('@/views/detect/ContentDetect.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'detect/image',
          name: 'DetectImage',
          component: () => import('@/views/detect/ImageDetect.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'detect/audio',
          name: 'DetectAudio',
          component: () => import('@/views/detect/AudioDetect.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('@/views/ProfileView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'complaint',
          name: 'Complaint',
          component: () => import('@/views/ComplaintView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'admin/users',
          name: 'AdminUsers',
          component: () => import('@/views/admin/AdminUsersView.vue'),
          meta: { requiresAuth: true, admin: true },
        },
      ],
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  const loggedIn = auth.isLoggedIn

  if (to.meta.requiresAuth && !loggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.meta.guest && loggedIn) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
