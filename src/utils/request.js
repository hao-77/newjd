import axios from 'axios'
import { ElMessage } from 'element-plus'
import { API_BASE_URL } from '@/config/api'

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.token = token
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res && typeof res === 'object' && 'code' in res) {
      if (res.code === 200 || res.code === 0) return res
      ElMessage.error(res.msg || '请求失败')
      return Promise.reject(new Error(res.msg || '请求失败'))
    }
    return res
  },
  (error) => {
    const msg = error?.response?.data?.msg || error?.message || '网络错误'
    ElMessage.error(msg)
    return Promise.reject(error)
  },
)

const request = {
  get(url, config) {
    return axiosInstance.get(url, config)
  },
  post(url, data, config) {
    return axiosInstance.post(url, data, config)
  },
  patch(url, data, config) {
    return axiosInstance.patch(url, data, config)
  },
  delete(url, config) {
    return axiosInstance.delete(url, config)
  },
}

export default request

