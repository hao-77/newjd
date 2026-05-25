import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, loginByCode, register, getUserInfo } from '@/api/user'
import type { LoginData, UserInfo } from '@/types/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref<UserInfo | null>(null)

  const isLoggedIn = computed(() => !!token.value)

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
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  function restore() {
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
    isLoggedIn,
    setAuth,
    logout,
    doLogin,
    doLoginByCode,
    doRegister,
    fetchUserInfo,
  }
})
