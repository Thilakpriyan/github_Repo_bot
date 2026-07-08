import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  RiGithubFill,
  RiArrowRightLine,
  RiDeleteBinLine,
  RiLoader4Line,
  RiChat3Line,
} from 'react-icons/ri'
import { indexRepository } from '../services/api'
import { useRepositories } from '../hooks/useRepositories'
import { ToastContainer, useToast } from '../components/Toast'
import Spinner from '../components/Spinner'

function RepoSkeleton() {
  return (
    <div className="animate-pulse flex items-center gap-3 py-2.5 px-3">
      <div className="w-4 h-4 rounded bg-slate-100 dark:bg-slate-800 shrink-0" />
      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-40" />
      <div className="ml-auto h-3 bg-slate-50 dark:bg-slate-800/50 rounded w-16" />
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const [repoUrl, setRepoUrl] = useState('')
  const [indexing, setIndexing] = useState(false)
  const [lastResult, setLastResult] = useState(null)
  const [deletingRepo, setDeletingRepo] = useState(null)

  const { repositories, loading, removeRepository, refetch } = useRepositories()
  const { toasts, addToast, removeToast } = useToast()

  const getName = (r) => typeof r === 'string' ? r : r.name ?? r.repository ?? Object.keys(r)[0] ?? 'unknown'
  const getUrl  = (r) => typeof r === 'object' ? r.url ?? r.repo_url ?? null : null

  const handleIndex = async (e) => {
    e.preventDefault()
    const url = repoUrl.trim()
    if (!url) return

    setIndexing(true)
    setLastResult(null)
    try {
      const result = await indexRepository(url)
      setLastResult(result)
      addToast(`"${result.repository}" indexed successfully`, 'success')
      setRepoUrl('')
      refetch()
    } catch (err) {
      addToast(err?.response?.data?.detail || err.message || 'Failed to index repository', 'error')
    } finally {
      setIndexing(false)
    }
  }

  const handleDelete = useCallback(async (name) => {
    setDeletingRepo(name)
    try {
      await removeRepository(name)
      addToast(`"${name}" removed`, 'success')
    } catch (err) {
      addToast(err?.response?.data?.detail || 'Failed to delete', 'error')
    } finally {
      setDeletingRepo(null)
    }
  }, [removeRepository, addToast])

  // Normalize repos — backend returns a dict { name: { url } }
  const repoList = (() => {
    if (!repositories) return []
    if (Array.isArray(repositories)) return repositories
    // dict shape: { "repo-name": { url: "..." } }
    return Object.entries(repositories).map(([name, meta]) => ({
      name,
      url: typeof meta === 'object' ? meta.url ?? null : null,
    }))
  })()

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <div className="max-w-2xl mx-auto px-6 py-16">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2 tracking-tight">
              GitHub Repository Chatbot
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Index a GitHub repository and ask questions about its code, architecture, and implementation.
            </p>
          </div>

          {/* Index form */}
          <div className="mb-10">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              Repository URL
            </label>
            <form onSubmit={handleIndex} className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-lg px-3 bg-white dark:bg-slate-900 focus-within:border-slate-400 dark:focus-within:border-slate-500 transition-colors">
                <RiGithubFill className="text-slate-400 shrink-0 text-base" />
                <input
                  type="url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/owner/repository"
                  disabled={indexing}
                  className="flex-1 py-2.5 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={indexing || !repoUrl.trim()}
                className="px-4 py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-700 dark:hover:bg-white disabled:opacity-40 text-white dark:text-slate-900 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shrink-0"
              >
                {indexing ? (
                  <>
                    <Spinner size="sm" className="text-white dark:text-slate-900" />
                    Indexing
                  </>
                ) : (
                  'Index'
                )}
              </button>
            </form>

            {/* Progress note */}
            {indexing && (
              <p className="mt-2.5 text-xs text-slate-400 flex items-center gap-1.5">
                <RiLoader4Line className="animate-spin" />
                Cloning and indexing — this may take a minute…
              </p>
            )}

            {/* Success result */}
            {lastResult && !indexing && (
              <div className="mt-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-3">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{lastResult.repository}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {lastResult.files} files · {lastResult.chunks} chunks indexed
                    </p>
                  </div>
                  <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 px-2 py-0.5 rounded-full shrink-0">
                    Ready
                  </span>
                </div>
                <button
                  onClick={() => navigate('/chat', { state: { repository: lastResult.repository } })}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-700 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-medium rounded-md transition-colors"
                >
                  <RiChat3Line className="text-sm" />
                  Open Chat
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 dark:border-slate-800 mb-8" />

          {/* Repositories */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Indexed Repositories
              </h2>
              {repoList.length > 0 && (
                <button
                  onClick={() => navigate('/chat')}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
                >
                  Open Chat <RiArrowRightLine />
                </button>
              )}
            </div>

            {loading ? (
              <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {[1, 2, 3].map((i) => <RepoSkeleton key={i} />)}
              </div>
            ) : repoList.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-600 py-4">
                No repositories indexed yet. Paste a GitHub URL above to get started.
              </p>
            ) : (
              <ul className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {repoList.map((r) => {
                  const name = getName(r)
                  const url  = getUrl(r)
                  const isDeleting = deletingRepo === name
                  return (
                    <li
                      key={name}
                      className="group flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    >
                      <RiGithubFill className="text-slate-400 dark:text-slate-600 text-sm shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-800 dark:text-slate-200 font-medium truncate">{name}</p>
                        {url && (
                          <p className="text-xs text-slate-400 truncate">{url}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => navigate('/chat', { state: { repository: name } })}
                          className="flex items-center gap-0.5 px-2 py-1 text-xs font-medium bg-slate-900 dark:bg-slate-100 hover:bg-slate-700 dark:hover:bg-white text-white dark:text-slate-900 rounded-md transition-colors"
                        >
                          <RiChat3Line className="text-xs" />
                          Chat
                        </button>
                        <button
                          onClick={() => handleDelete(name)}
                          disabled={isDeleting}
                          className="w-6 h-6 flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors disabled:opacity-50 rounded"
                        >
                          {isDeleting ? <Spinner size="sm" /> : <RiDeleteBinLine className="text-xs" />}
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  )
}
