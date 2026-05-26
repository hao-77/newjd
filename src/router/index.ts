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
      ],
    },
    /** 管理后台：独立页面，侧边栏无入口，直接访问 /admin/users */
    {
      path: '/admin/users',
      name: 'AdminUsers',
      component: () => import('@/views/admin/AdminUsersPage.vue'),
      meta: { admin: true },
    },
    {
      path: '/admin',
      redirect: '/admin/users',
    },
  ],
})

function checkLoggedIn(): boolean {
  const token = localStorage.getItem('token')
  const devSkip = import.meta.env.DEV && localStorage.getItem('dev_skip_login') === '1'
  return !!token || devSkip
}

router.beforeEach((to, _from, next) => {
  const loggedIn = checkLoggedIn()

  // 管理端页面自行处理未登录展示，避免白屏重定向
  if (to.meta.admin) {
    next()
    return
  }

  if (to.meta.requiresAuth && !loggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.meta.guest && loggedIn) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
