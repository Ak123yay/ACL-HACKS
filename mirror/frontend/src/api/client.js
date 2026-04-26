import axios from 'axios'

const rawApiUrl = (import.meta.env.VITE_API_URL || '').trim()
const normalizeApiBase = (url) => {
  if (!url) return '/api'

  let normalized = url.replace(/\/+$/, '').replace(/\/api$/, '')

  // Prevent accidental relative-path API URLs in production (e.g. "my-api.up.railway.app").
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`
  }

  return normalized
}

const BASE = normalizeApiBase(rawApiUrl)

if (!rawApiUrl && typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
  console.warn('[Mirror] VITE_API_URL is not set in Vercel; API requests may fail in production.')
}

const http = axios.create({ baseURL: BASE, headers: { 'Content-Type': 'application/json' } })

http.interceptors.request.use(async (config) => {
  const { supabase } = await import('../lib/supabase')
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) config.headers.Authorization = `Bearer ${session.access_token}`
  return config
})

// Ingest
export const uploadFile      = (fd, onProgress) => http.post('/ingest/upload', fd, {
  headers: { 'Content-Type': 'multipart/form-data' },
  onUploadProgress: (e) => onProgress?.(Math.round((e.loaded / e.total) * 100)),
})
export const saveReflections = (userId, answers) => http.post('/ingest/questions', { user_id: userId, answers })
export const getIngestStatus = (jobId)           => http.get(`/ingest/status/${jobId}`)

// Persona
export const generatePersona = (userId)  => http.post('/persona/generate', { user_id: userId })
export const getPersona      = (cloneId) => http.get(`/persona/${cloneId}`)

// Voice
export const transcribeAudio = (audioBlob) => {
  const fd = new FormData()
  fd.append('audio', audioBlob, 'recording.webm')
  return http.post('/voice/transcribe', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
}
export const cloneVoice = (audioBlob, userId) => {
  const fd = new FormData()
  fd.append('audio', audioBlob, 'voice_sample.webm')
  fd.append('user_id', userId)
  return http.post('/voice/clone', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
}

// Session
export const startSession = (payload) => http.post('/session/start', payload)
export const endSession   = (payload) => http.post('/session/end', payload)
export const getSessions  = ()        => http.get('/session/list')
export const getSession   = (id)      => http.get(`/session/${id}`)

// Journal
export const getJournalEntries = ()   => http.get('/journal/list')
export const getJournalEntry   = (id) => http.get(`/journal/${id}`)

// Insights
export const getMoodInsights  = () => http.get('/insights/mood')
export const getUsageInsights = () => http.get('/insights/usage')
export const getThemeInsights = () => http.get('/insights/themes')

// Profile
export const getProfile    = (userId) => http.get(`/profile/${userId}`)
export const updateProfile = (userId, data) => http.patch(`/profile/${userId}`, data)

// Chat — sends payload, gets back a stream_token, opens EventSource
export const createChatStream = async (payload) => {
  const res   = await http.post('/chat/message', payload)
  const token = res.data.stream_token
  return new EventSource(`${BASE}/chat/stream?token=${encodeURIComponent(token)}`)
}

export default http
