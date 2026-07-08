import { RiGithubFill, RiDeleteBinLine } from 'react-icons/ri'
import Spinner from './Spinner'

export default function RepositoryCard({ name, url, onDelete, deleting }) {
  return (
    <div className="group flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
          <RiGithubFill className="text-slate-600 dark:text-slate-400 text-sm" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{name}</p>
          {url && (
            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{url}</p>
          )}
        </div>
      </div>
      <button
        onClick={() => onDelete(name)}
        disabled={deleting}
        className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
        aria-label={`Delete ${name}`}
      >
        {deleting ? <Spinner size="sm" /> : <RiDeleteBinLine className="text-sm" />}
      </button>
    </div>
  )
}
