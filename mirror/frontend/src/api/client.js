// frontend/src/api/client.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
})

export const uploadFile = (userId, file, source, userName = '') => {
  const form = new FormData()
  form.append('user_id', userId)
  form.append('file', file)
  form.append('source', source)
  form.append('user_name', userName)
  return api.post('/ingest/upload', form)
}

export const getIngestStatus = (jobId) => api.get(`/ingest/status/${jobId}`)
export const saveReflections = (userId, answers) =>
  api.post('/ingest/questions', { user_id: userId, answers })
export const generatePersona = (userId) =>
  api.post('/persona/generate', { user_id: userId })
export const getPersona = (userId) => api.get(`/persona/${userId}`)

export const cloneVoice = (userId, userName, audioBlob) => {
  const form = new FormData()
  form.append('user_id', userId)
  form.append('user_name', userName)
  form.append('audio', audioBlob, 'voice_sample.webm')
  return api.post('/voice/clone', form)
}

export const transcribeAudio = (audioBlob) => {
  const form = new FormData()
  form.append('audio', audioBlob, 'recording.webm')
  return api.post('/voice/transcribe', form)
}

export const startSession = (userId, mode, intention, moodBefore) =>
  api.post('/session/start', { user_id: userId, mode, intention, mood_before: moodBefore })
export const endSession = (sessionId, userId, messages, moodAfter) =>
  api.post('/session/end', { session_id: sessionId, user_id: userId, messages, mood_after: moodAfter })
export const listSessions = (userId) => api.get(`/session/list?user_id=${userId}`)
export const getMoodData = (userId) => api.get(`/insights/mood?user_id=${userId}`)
export const getUsageStats = (userId) => api.get(`/insights/stats?user_id=${userId}`)
export default api
