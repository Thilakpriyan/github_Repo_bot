import axios from 'axios'

// In development: uses VITE_API_URL from .env.local (falls back to localhost)
// In production (Vercel): set VITE_API_URL in Vercel project environment variables
const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000,
})

export async function indexRepository(repoUrl) {
  const { data } = await api.post('/index', { repo_url: repoUrl })
  return data
}

export async function chat(repository, question) {
  const { data } = await api.post('/chat', { repository, question })
  return data
}

export async function getRepositories() {
  const { data } = await api.get('/repositories')
  return data
}

export async function deleteRepository(repoName) {
  const { data } = await api.delete(`/repository/${repoName}`)
  return data
}

export async function health() {
  const { data } = await api.get('/health')
  return data
}

export default api
