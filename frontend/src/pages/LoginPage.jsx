import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { RiGithubFill, RiEyeLine, RiEyeOffLine, RiMoonLine, RiSunLine } from 'react-icons/ri'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../hooks/useTheme'
import Spinner from '../components/Spinner'

export default function LoginPage() {
  const { login, signup } = useAuth()
  const navigate = useNavigate()
  const { dark, toggle } = useTheme()

  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await signup(name, email, password)
      }
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">

      {/* Minimal top bar */}
      <div className="flex items-center justify-between px-6 h-12 border-b border-slate-100 dark:border-slate-800">
        <Link to="/" className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
          RepoChat
        </Link>
        <button
          onClick={toggle}
          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
        >
          {dark ? <RiSunLine className="text-sm" /> : <RiMoonLine className="text-sm" />}
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">

          {/* Heading */}
          <div className="mb-8">
            <div className="w-9 h-9 rounded-lg bg-slate-900 dark:bg-slate-100 flex items-center justify-center mb-5">
              <RiGithubFill className="text-white dark:text-slate-900 text-lg" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {mode === 'login'
                ? 'Sign in to continue to RepoChat'
                : 'Start chatting with your repositories'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-3 py-2.5 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-lg">
              <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name field — signup only */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full px-3 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-slate-400 dark:focus:border-slate-500 transition-colors"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-slate-400 dark:focus:border-slate-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full px-3 py-2.5 pr-10 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-slate-400 dark:focus:border-slate-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  tabIndex={-1}
                >
                  {showPw ? <RiEyeOffLine className="text-sm" /> : <RiEyeLine className="text-sm" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-700 dark:hover:bg-white disabled:opacity-50 text-white dark:text-slate-900 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Spinner size="sm" className="text-white dark:text-slate-900" />}
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
            <span className="text-xs text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
          </div>

          {/* Toggle mode */}
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
              className="font-medium text-slate-800 dark:text-slate-200 hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>

        </div>
      </div>
    </div>
  )
}
