import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import type { ApiResult } from '@/types/api'
import { API_BASE_URL } from '@/config/api'
import { ElMessage } from 'element-plus'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
})

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.token = token
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res && typeof res === 'object' && 'code' in res) {
      if (res.code === 200 || res.code === 0) {
        return res
      }
      ElMessage.error(res.msg || '请求失败')
      return Promise.reject(new Error(res.msg || '请求失败'))
    }
    return res
  },
  (error) => {
    const msg = error.response?.data?.msg || error.message || '网络错误'
    ElMessage.error(msg)
    return Promise.reject(error)
  },
)

const request = {
  get<T>(url: string, config?: AxiosRequestConfig) {
    return axiosInstance.get(url, config) as Promise<ApiResult<T>>
  },
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return axiosInstance.post(url, data, config) as Promise<ApiResult<T>>
  },
  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return axiosInstance.patch(url, data, config) as Promise<ApiResult<T>>
  },
  delete<T>(url: string, config?: AxiosRequestConfig) {
    return axiosInstance.delete(url, config) as Promise<ApiResult<T>>
  },
}

export default request
