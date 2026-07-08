import { useState, useEffect } from 'react'
import { health } from '../services/api'

export function useHealth() {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    let cancelled = false

    const check = async () => {
      try {
        const data = await health()
        if (!cancelled) setStatus(data.status === 'healthy' ? 'healthy' : 'degraded')
      } catch {
        if (!cancelled) setStatus('offline')
      }
    }

    check()
    const interval = setInterval(check, 30000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return status
}
