import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('rc_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const login = useCallback((email, password) => {
    // Frontend-only auth — no backend required
    // In production replace this with a real API call
    if (!email || !password) throw new Error('Email and password are required')
    if (password.length < 6) throw new Error('Password must be at least 6 characters')

    const userData = { email, name: email.split('@')[0] }
    setUser(userData)
    localStorage.setItem('rc_user', JSON.stringify(userData))
    return userData
  }, [])

  const signup = useCallback((name, email, password) => {
    if (!name || !email || !password) throw new Error('All fields are required')
    if (password.length < 6) throw new Error('Password must be at least 6 characters')

    const userData = { email, name }
    setUser(userData)
    localStorage.setItem('rc_user', JSON.stringify(userData))
    return userData
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('rc_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
