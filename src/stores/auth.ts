import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, loginByCode, register, getUserInfo } from '@/api/user'
import type { LoginData, UserInfo } from '@/types/api'
import { isDev } from '@/config/dev'

const DEV_SKIP_KEY = 'dev_skip_login'
const DEV_TOKEN = 'dev-local-skip-token'

const devMockUser: UserInfo = {
  userId: 'dev-001',
  userName: '开发测试用户',
  email: 'dev@test.local',
  signature: '开发模式 · 已跳过登录',
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref<UserInfo | null>(null)
  const devSkipLogin = ref(isDev && localStorage.getItem(DEV_SKIP_KEY) === '1')

  const isLoggedIn = computed(() => !!token.value || devSkipLogin.value)

  function setAuth(data: LoginData) {
    token.value = data.token
    localStorage.setItem('token', data.token)
    user.value = {
      userId: String(data.userId),
      userName: data.userName,
      signature: data.signature,
      gender: data.gender,
      status: data.status,
      avatar: data.avatar,
    }
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  function logout() {
    token.value = ''
    user.value = null
    devSkipLogin.value = false
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem(DEV_SKIP_KEY)
  }

  /** 仅开发环境：跳过登录，使用本地模拟账号 */
  function skipLoginForDev() {
    if (!isDev) return
    devSkipLogin.value = true
    token.value = DEV_TOKEN
    user.value = { ...devMockUser }
    localStorage.setItem(DEV_SKIP_KEY, '1')
    localStorage.setItem('token', DEV_TOKEN)
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  function restore() {
    if (devSkipLogin.value) {
      token.value = DEV_TOKEN
      user.value = { ...devMockUser }
      return
    }
    const saved = localStorage.getItem('user')
    if (saved) {
      try {
        user.value = JSON.parse(saved)
      } catch {
        user.value = null
      }
    }
  }

  async function doLogin(email: string, password: string) {
    const res = await login({ email, password })
    if (res.data) setAuth(res.data)
    return res
  }

  async function doLoginByCode(email: string, code: string) {
    const res = await loginByCode({ email, code })
    if (res.data) setAuth(res.data)
    return res
  }

  async function doRegister(email: string, password: string, code: string) {
    return register({ email, password, code })
  }

  async function fetchUserInfo() {
    const res = await getUserInfo()
    if (res.data) {
      user.value = { ...user.value, ...res.data }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
    return res
  }

  restore()

  return {
    token,
    user,
    devSkipLogin,
    isLoggedIn,
    isDev,
    setAuth,
    logout,
    skipLoginForDev,
    doLogin,
    doLoginByCode,
    doRegister,
    fetchUserInfo,
  }
})
