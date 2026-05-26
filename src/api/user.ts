import request, { axiosInstance } from '@/utils/request'
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

/** 获取图片上传后的访问地址 */
export function getUploadUrl(fileName: string) {
  return request.get<unknown>('/user/common/uploadUrl', {
    params: { fileName },
  })
}

/** 上传图片二进制到服务端（路径为 /文件名） */
export function uploadImageBinary(fileName: string, file: File) {
  return axiosInstance.put(`/${fileName}`, file, {
    headers: { 'Content-Type': 'application/octet-stream' },
  })
}

/** 更新用户头像 */
export function updateAvatar(avatarUrl: string) {
  return request.patch<unknown>('/user/updateAvatar', { avatarUrl })
}

function parseUploadUrl(data: unknown): string {
  if (typeof data === 'string' && data.startsWith('http')) return data
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    const url = d.url || d.avatarUrl || d.fileUrl || d.uploadUrl
    if (typeof url === 'string') return url
  }
  throw new Error('无法解析图片地址')
}

/** 完整头像上传流程：获取 URL → 上传文件 → 更新头像 */
export async function uploadAndUpdateAvatar(file: File): Promise<string> {
  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg'
  const fileName = `${Date.now()}.${ext}`

  const urlRes = await getUploadUrl(fileName)
  const avatarUrl = parseUploadUrl(urlRes.data)

  await uploadImageBinary(fileName, file)
  await updateAvatar(avatarUrl)

  return avatarUrl
}

export function testJWT() {
  return request.get<unknown>('/user/testJWT')
}
