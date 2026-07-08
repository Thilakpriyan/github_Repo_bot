import { useState, useEffect, useCallback } from 'react'
import { getRepositories, deleteRepository as apiDelete } from '../services/api'

export function useRepositories() {
  const [repositories, setRepositories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchRepositories = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getRepositories()
      // Backend returns a dict: { "repo-name": { "url": "..." } }
      // Store it as-is; pages normalize it themselves
      setRepositories(data ?? [])
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to load repositories')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRepositories()
  }, [fetchRepositories])

  const removeRepository = useCallback(async (repoName) => {
    await apiDelete(repoName)
    // Works for both array and dict shapes
    setRepositories((prev) => {
      if (Array.isArray(prev)) {
        return prev.filter((r) => {
          const n = typeof r === 'string' ? r : r.name ?? r.repository
          return n !== repoName
        })
      }
      // dict shape
      const copy = { ...prev }
      delete copy[repoName]
      return copy
    })
  }, [])

  return { repositories, loading, error, refetch: fetchRepositories, removeRepository }
}
