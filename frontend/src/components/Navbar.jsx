import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { RiMoonLine, RiSunLine, RiLogoutBoxLine, RiUserLine } from 'react-icons/ri'
import { useTheme } from '../hooks/useTheme'
import { useHealth } from '../hooks/useHealth'
import { useAuth } from '../context/AuthContext'

function ThemeToggle({ dark, toggle }) {
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={`relative w-14 h-7 rounded-full border transition-colors duration-200 flex items-center px-0.5 ${
        dark
          ? 'bg-slate-800 border-slate-700'
          : 'bg-slate-100 border-slate-200'
      }`}
    >
      {/* Track icons */}
      <RiSunLine className="absolute left-1.5 text-[11px] text-slate-400" />
      <RiMoonLine className="absolute right-1.5 text-[11px] text-slate-400" />

      {/* Thumb */}
      <span
        className={`relative z-10 w-5 h-5 rounded-full shadow-sm transition-transform duration-200 flex items-center justify-center ${
          dark
            ? 'translate-x-7 bg-slate-200'
            : 'translate-x-0 bg-white border border-slate-200'
        }`}
      >
        {dark
          ? <RiMoonLine className="text-slate-700 text-[10px]" />
          : <RiSunLine  className="text-slate-500 text-[10px]" />
        }
      </span>
    </button>
  )
}

function UserMenu({ user, logout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const initial = user.name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? 'U'

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
      >
        <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-semibold flex items-center justify-center shrink-0">
          {initial}
        </span>
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300 max-w-[80px] truncate">
          {user.name ?? user.email}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg shadow-lg py-1 z-50">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
          </div>
          <button
            onClick={() => { logout(); navigate('/login') }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <RiLogoutBoxLine className="text-sm" />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const { dark, toggle } = useTheme()
  const status  = useHealth()
  const location = useLocation()
  const { user } = useAuth()
  const navigate = useNavigate()

  const healthy  = status === 'healthy'
  const checking = status === 'checking'
  const { logout } = useAuth()

  return (
    <header className="h-12 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center px-6 shrink-0">
      <div className="flex items-center gap-6 w-full max-w-6xl mx-auto">

        {/* Logo */}
        <Link to="/" className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-tight shrink-0">
          RepoChat
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {[{ to: '/', label: 'Home' }, { to: '/chat', label: 'Chat' }].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                location.pathname === to
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-4">

          {/* Health */}
          <div className="hidden sm:flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              checking ? 'bg-slate-300 dark:bg-slate-600 animate-pulse' :
              healthy  ? 'bg-emerald-400' : 'bg-red-400'
            }`} />
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {checking ? 'Connecting' : healthy ? 'Connected' : 'Offline'}
            </span>
          </div>

          {/* Theme pill toggle */}
          <ThemeToggle dark={dark} toggle={toggle} />

          {/* Auth */}
          {user ? (
            <UserMenu user={user} logout={logout} />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/login"
                className="px-3 py-1.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-700 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-medium rounded-md transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}

        </div>
      </div>
    </header>
  )
}
