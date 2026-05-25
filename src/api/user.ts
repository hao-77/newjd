import request from '@/utils/request'
import type { LoginData, UserInfo } from '@/types/api'

export function login(data: { email: string; password: string }) {
  return request.post<LoginData>('/user/login', data)
}

export function loginByCode(data: { email: string; code: string }) {
  return request.post<LoginData>('/user/loginCode', data)
}

export function register(data: { email: string; password: string; code: string }) {
  return request.post<unknown>('/user/register', data)
}

export function getCode(targetEmail: string, type: string) {
  return request.get<unknown>('/user/common/getCode', {
    params: { targetEmail, type },
  })
}

export function getUserInfo() {
  return request.get<UserInfo>('/user/getUserInfo')
}

export function updateUser(data: Partial<UserInfo>) {
  return request.post<unknown>('/user/update', data)
}

export function changePassword(data: {
  email: string
  oldPassword: string
  newPassword: string
  code: string
}) {
  return request.post<unknown>('/user/changePassword', data)
}

export function testJWT() {
  return request.get<unknown>('/user/testJWT')
}
