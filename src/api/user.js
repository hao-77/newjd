import request, { axiosInstance } from '@/utils/request'

export function login(data) {
  return request.post('/user/login', data)
}

export function loginByCode(data) {
  return request.post('/user/loginCode', data)
}

export function register(data) {
  return request.post('/user/register', data)
}

export function getCode(targetEmail, type) {
  return request.get('/user/common/getCode', { params: { targetEmail, type } })
}

export function getUserInfo() {
  return request.get('/user/getUserInfo')
}

export function updateUser(data) {
  return request.post('/user/update', data)
}

export function changePassword(data) {
  return request.post('/user/changePassword', data)
}

export function getUploadUrl(fileName) {
  return request.get('/user/common/uploadUrl', { params: { fileName } })
}

export function uploadImageBinary(fileName, file) {
  return axiosInstance.put(`/${fileName}`, file, {
    headers: { 'Content-Type': 'application/octet-stream' },
  })
}

export function updateAvatar(avatarUrl) {
  return request.patch('/user/updateAvatar', { avatarUrl })
}

function parseUploadUrl(data) {
  if (typeof data === 'string' && data.startsWith('http')) return data
  if (data && typeof data === 'object') {
    const url = data.url || data.avatarUrl || data.fileUrl || data.uploadUrl
    if (typeof url === 'string') return url
  }
  throw new Error('无法解析图片地址')
}

export async function uploadAndUpdateAvatar(file) {
  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg'
  const fileName = `${Date.now()}.${ext}`

  const urlRes = await getUploadUrl(fileName)
  const avatarUrl = parseUploadUrl(urlRes.data ?? urlRes)

  await uploadImageBinary(fileName, file)
  await updateAvatar(avatarUrl)

  return avatarUrl
}

export function testJWT() {
  return request.get('/user/testJWT')
}

