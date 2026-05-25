import request from '@/utils/request'
import type { Detect1Request, Detect2Request, SessionItem } from '@/types/api'

export function createSession(sessionName: string) {
  return request.post<SessionItem>('/session/create', { sessionName })
}

export function getSessions() {
  return request.get<SessionItem[]>('/session')
}

export function getSessionHistory(sessionId: string) {
  return request.get<unknown>('/session/history', { params: { sessionId } })
}

export function aiPredict(data: { userId: string; sessionId: string; content: string }) {
  return request.post<unknown>('/api/ai/predict', data)
}

export function newDialogue(params: {
  userId?: string
  characterType?: string
  name?: string
  description?: string
}) {
  return request.post<unknown>('/ai/newDialogue', null, { params })
}

export function detectTransaction(data: Detect1Request) {
  return request.post<unknown>('/ai/detect1', data)
}

export function detectContent(data: Detect2Request) {
  return request.post<unknown>('/ai/detect2', data)
}

export function detectImage(file: File, printYn = 'false') {
  const form = new FormData()
  form.append('image', file)
  return request.post<unknown>('/ai/image', form, {
    params: { print_yn: printYn },
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function detectAudio(file: File) {
  const form = new FormData()
  form.append('file', file)
  return request.post<unknown>('/ai/audio', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function imageTextOcr(file: File) {
  const form = new FormData()
  form.append('file', file)
  return request.post<unknown>('/ai/imageText', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function submitComplaint(text: string) {
  return request.post<unknown>('/complaint', { text })
}

export function getComplaints() {
  return request.get<unknown>('/complaint')
}
