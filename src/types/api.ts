export interface ApiResult<T = unknown> {
  code: number
  msg: string
  data: T
}

export interface LoginData {
  userId: string | number
  userName: string
  signature?: string
  gender?: number
  status?: number
  token: string
  avatar?: string
}

export interface UserInfo {
  userId?: string
  userName?: string
  email?: string
  phone?: string
  signature?: string
  gender?: number
  status?: number
  avatar?: string
  avatarUrl?: string
}

export interface SessionItem {
  sessionId: string
  sessionName?: string
  createTime?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  time?: string
}

export interface Detect1Request {
  step: string
  type: string
  amount: string
  nameDest: string
  oldbalanceOrg: string
  newbalanceOrig: string
  oldbalanceDest: string
  newbalanceDest: string
}

export interface Detect2Request {
  content: string
  content_type: string
  is_url: boolean
}

/** 管理端用户信息 */
export interface AdminUser {
  userId: string
  userName?: string
  username?: string
  email?: string
  phone?: string
  signature?: string
  gender?: number
  status?: number
  password?: string
  createdAt?: string
  updatedAt?: string
  avatar?: string
  avatarUrl?: string
}
