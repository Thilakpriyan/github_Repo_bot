import { useState, useRef, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import {
  RiGithubFill,
  RiDeleteBinLine,
  RiSendPlaneLine,
  RiMenuLine,
  RiCloseLine,
  RiRobot2Line,
  RiUserLine,
  RiRefreshLine,
} from 'react-icons/ri'
import { chat } from '../services/api'
import { useRepositories } from '../hooks/useRepositories'
import { ToastContainer, useToast } from '../components/Toast'
import MarkdownRenderer from '../components/MarkdownRenderer'
import Spinner from '../components/Spinner'

const SUGGESTIONS = [
  'Explain the project structure',
  'How does authentication work?',
  'What are the main dependencies?',
  'Show me the data models',
]

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )
}

function ChatMessage({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
        isUser
          ? 'bg-slate-900 dark:bg-slate-100'
          : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
      }`}>
        {isUser
          ? <RiUserLine className="text-white dark:text-slate-900 text-xs" />
          : <RiRobot2Line className="text-slate-500 dark:text-slate-400 text-xs" />
        }
      </div>

      {/* Bubble */}
      <div className={`max-w-[78%] rounded-xl px-4 py-3 ${
        isUser
          ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
          : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800'
      }`}>
        {isUser
          ? <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
          : <MarkdownRenderer content={msg.content} />
        }
        <p className={`text-[11px] mt-1.5 ${
          isUser ? 'text-slate-400 dark:text-slate-500 text-right' : 'text-slate-400 dark:text-slate-600'
        }`}>
          {new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}

export default function ChatPage() {
  const location = useLocation()
  const passedRepo = location.state?.repository ?? null

  const { repositories, loading: reposLoading, removeRepository, refetch } = useRepositories()
  const { toasts, addToast, removeToast } = useToast()

  const getName = useCallback((r) => {
    if (typeof r === 'string') return r
    if (r.name) return r.name
    if (r.repository) return r.repository
    const keys = Object.keys(r)
    return keys[0] ?? 'unknown'
  }, [])

  // Normalize repo list — backend returns dict or array
  const repoList = (() => {
    if (!repositories) return []
    if (Array.isArray(repositories)) return repositories
    return Object.entries(repositories).map(([name, meta]) => ({
      name,
      url: typeof meta === 'object' ? meta.url ?? null : null,
    }))
  })()

  const [selectedRepo, setSelectedRepo] = useState(passedRepo)
  const [messages, setMessages]         = useState([])
  const [question, setQuestion]         = useState('')
  const [asking, setAsking]             = useState(false)
  const [deletingRepo, setDeletingRepo] = useState(null)
  const [sidebarOpen, setSidebarOpen]   = useState(false)

  const bottomRef   = useRef(null)
  const textareaRef = useRef(null)
  const historyRef  = useRef({})

  // Auto-select first repo
  useEffect(() => {
    if (!selectedRepo && repoList.length > 0) {
      setSelectedRepo(getName(repoList[0]))
    }
  }, [repoList, selectedRepo, getName])

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, asking])

  const selectRepo = useCallback((name) => {
    setSelectedRepo(name)
    setMessages(historyRef.current[name] ?? [])
    setSidebarOpen(false)
  }, [])

  const sendMessage = async (text) => {
    const q = (text ?? question).trim()
    if (!q || !selectedRepo || asking) return

    const next = [...messages, { role: 'user', content: q, ts: Date.now() }]
    setMessages(next)
    setQuestion('')
    setAsking(true)

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      const res = await chat(selectedRepo, q)
      const final = [...next, { role: 'ai', content: res.answer, ts: Date.now() }]
      setMessages(final)
      historyRef.current[selectedRepo] = final
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || 'Something went wrong.'
      const final = [...next, { role: 'ai', content: `**Error:** ${msg}`, ts: Date.now() }]
      setMessages(final)
      historyRef.current[selectedRepo] = final
    } finally {
      setAsking(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleDelete = useCallback(async (name) => {
    setDeletingRepo(name)
    try {
      await removeRepository(name)
      addToast(`"${name}" removed`, 'success')
      if (selectedRepo === name) {
        const remaining = repoList.filter((r) => getName(r) !== name)
        const next = remaining.length > 0 ? getName(remaining[0]) : null
        setSelectedRepo(next)
        setMessages(next ? historyRef.current[next] ?? [] : [])
      }
    } catch (err) {
      addToast(err?.response?.data?.detail || 'Failed to delete', 'error')
    } finally {
      setDeletingRepo(null)
    }
  }, [removeRepository, addToast, selectedRepo, repoList, getName])

  const clearChat = () => {
    setMessages([])
    if (selectedRepo) historyRef.current[selectedRepo] = []
  }

  return (
    <>
      <div className="flex h-[calc(100vh-3rem)] bg-white dark:bg-slate-950 overflow-hidden">

        {/* ── Sidebar ── */}
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 dark:bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside className={`
          fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto
          w-56 flex flex-col shrink-0
          bg-white dark:bg-slate-950
          border-r border-slate-100 dark:border-slate-800
          transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Sidebar header */}
          <div className="h-12 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Repositories
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={refetch}
                className="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title="Refresh"
              >
                <RiRefreshLine className="text-xs" />
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden w-6 h-6 flex items-center justify-center rounded text-slate-400"
              >
                <RiCloseLine className="text-sm" />
              </button>
            </div>
          </div>

          {/* Repo list */}
          <div className="flex-1 overflow-y-auto scrollbar-thin py-2 px-2">
            {reposLoading ? (
              <div className="space-y-1 px-1 py-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 rounded-md bg-slate-50 dark:bg-slate-900 animate-pulse" />
                ))}
              </div>
            ) : repoList.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-600 px-2 py-3">
                No repositories. Index one from Home.
              </p>
            ) : (
              <ul className="space-y-0.5">
                {repoList.map((r) => {
                  const name = getName(r)
                  const active = selectedRepo === name
                  const isDeleting = deletingRepo === name
                  return (
                    <li key={name}>
                      <div
                        className={`group flex items-center gap-2 w-full px-2.5 py-2 rounded-md text-left cursor-pointer transition-colors ${
                          active
                            ? 'bg-slate-100 dark:bg-slate-800'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-900'
                        }`}
                        onClick={() => selectRepo(name)}
                      >
                        <RiGithubFill className={`text-xs shrink-0 ${active ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-600'}`} />
                        <span className={`flex-1 text-xs truncate ${active ? 'font-medium text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>
                          {name}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(name) }}
                          disabled={isDeleting}
                          className="w-5 h-5 flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50 rounded shrink-0"
                        >
                          {isDeleting ? <Spinner size="sm" /> : <RiDeleteBinLine className="text-[10px]" />}
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Chat topbar */}
          <div className="h-12 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <RiMenuLine className="text-sm" />
              </button>

              {reposLoading ? (
                <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 animate-pulse rounded" />
              ) : repoList.length > 0 ? (
                <div className="flex items-center gap-2">
                  <RiGithubFill className="text-slate-400 text-sm" />
                  <select
                    value={selectedRepo ?? ''}
                    onChange={(e) => selectRepo(e.target.value)}
                    className="text-sm font-medium text-slate-800 dark:text-slate-200 bg-transparent border-none outline-none cursor-pointer"
                  >
                    <option value="" disabled>Select repository</option>
                    {repoList.map((r) => {
                      const name = getName(r)
                      return <option key={name} value={name}>{name}</option>
                    })}
                  </select>
                </div>
              ) : (
                <span className="text-sm text-slate-400">No repositories indexed</span>
              )}
            </div>

            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
              >
                <RiRefreshLine className="text-xs" />
                Clear
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-6 space-y-5">
            {!selectedRepo ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <RiGithubFill className="text-slate-200 dark:text-slate-800 text-4xl mb-3" />
                <p className="text-sm text-slate-400">Select a repository from the sidebar</p>
              </div>

            ) : messages.length === 0 && !asking ? (
              <div className="flex flex-col items-center justify-center h-full gap-5">
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Ask about <span className="font-semibold">{selectedRepo}</span>
                  </p>
                  <p className="text-xs text-slate-400">Try one of these or write your own question</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center max-w-md">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-xs px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors bg-white dark:bg-slate-950"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

            ) : (
              <>
                {messages.map((msg, i) => <ChatMessage key={i} msg={msg} />)}

                {asking && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <RiRobot2Line className="text-slate-500 dark:text-slate-400 text-xs" />
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3">
                      <TypingIndicator />
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="shrink-0 px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
            <div className={`flex gap-2 border rounded-xl px-3 py-2 transition-colors ${
              selectedRepo
                ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus-within:border-slate-400 dark:focus-within:border-slate-500'
                : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 opacity-50'
            }`}>
              <textarea
                ref={textareaRef}
                rows={1}
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px'
                }}
                onKeyDown={handleKeyDown}
                disabled={!selectedRepo || asking}
                placeholder={selectedRepo ? `Ask about ${selectedRepo}…` : 'Select a repository first'}
                className="flex-1 resize-none bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none py-1 leading-relaxed min-h-[28px] max-h-[140px] disabled:cursor-not-allowed"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!selectedRepo || !question.trim() || asking}
                className="self-end w-8 h-8 rounded-lg bg-slate-900 dark:bg-slate-100 hover:bg-slate-700 dark:hover:bg-white disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white dark:text-slate-900 disabled:text-slate-400 flex items-center justify-center transition-colors shrink-0"
              >
                {asking
                  ? <Spinner size="sm" className="text-white dark:text-slate-900" />
                  : <RiSendPlaneLine className="text-xs" />
                }
              </button>
            </div>
            <p className="text-[11px] text-slate-300 dark:text-slate-700 text-center mt-1.5">
              Enter to send · Shift+Enter for new line
            </p>
          </div>

        </main>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  )
}
