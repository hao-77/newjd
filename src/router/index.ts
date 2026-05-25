import { createRouter, createWebHistory } from 'vue-router'

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
      ],
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.meta.guest && token) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
