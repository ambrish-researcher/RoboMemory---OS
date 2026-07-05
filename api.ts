import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000'
})

export const sendMessage = async (
  message: string,
  history: any[]
) => {
  const res = await api.post('/api/chat', {
    message,
    conversation_history: history
  })
  return res.data
}

export const getMemories = async (search?: string) => {
  const params = search ? { search } : {}
  const res = await api.get('/api/memories', { params })
  return res.data.memories || []
}

export const improveMemories = async () => {
  const res = await api.post('/api/memories/improve')
  return res.data
}

export const forgetMemory = async (id: string) => {
  const res = await api.delete(`/api/memories/${id}`)
  return res.data
}

export const getGraph = async () => {
  const res = await api.get('/api/graph')
  return res.data
}

export const getProfile = async () => {
  const res = await api.get('/api/profile')
  return res.data
}

export const generateSummary = async () => {
  const res = await api.post('/api/profile/summarize')
  return res.data
}

export const ingestText = async (text: string) => {
  const res = await api.post('/api/ingest/text', { text })
  return res.data
}

export const ingestFile = async (file: File) => {
  const form = new FormData()
  form.append('file', file)
  const res = await api.post('/api/ingest/file', form)
  return res.data
}
