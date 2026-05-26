import request from '@/utils/request'

export function createSession(sessionName) {
  return request.post('/session/create', { sessionName })
}

export function getSessions() {
  return request.get('/session')
}

export function getSessionHistory(sessionId) {
  return request.get('/session/history', { params: { sessionId } })
}

export function aiPredict(data) {
  return request.post('/api/ai/predict', data)
}

export function newDialogue(params) {
  return request.post('/ai/newDialogue', null, { params })
}

export function detectTransaction(data) {
  return request.post('/ai/detect1', data)
}

export function detectContent(data) {
  return request.post('/ai/detect2', data)
}

export function detectImage(file, printYn = 'false') {
  const form = new FormData()
  form.append('image', file)
  return request.post('/ai/image', form, {
    params: { print_yn: printYn },
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function detectAudio(file) {
  const form = new FormData()
  form.append('file', file)
  return request.post('/ai/audio', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function imageTextOcr(file) {
  const form = new FormData()
  form.append('file', file)
  return request.post('/ai/imageText', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function submitComplaint(text) {
  return request.post('/complaint', { text })
}

export function getComplaints() {
  return request.get('/complaint')
}

