import { useEffect, useState } from 'react'
import { RiCheckLine, RiErrorWarningLine, RiCloseLine } from 'react-icons/ri'

export function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className="flex items-start gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg px-4 py-3 min-w-72 max-w-sm">
      <span className={`mt-0.5 shrink-0 ${type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
        {type === 'success' ? <RiCheckLine /> : <RiErrorWarningLine />}
      </span>
      <p className="text-xs text-slate-700 dark:text-slate-300 flex-1 leading-relaxed">{message}</p>
      <button
        onClick={onClose}
        className="text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 transition-colors mt-0.5"
      >
        <RiCloseLine className="text-sm" />
      </button>
    </div>
  )
}

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  )
}

let _id = 0
export function useToast() {
  const [toasts, setToasts] = useState([])
  const addToast = (message, type = 'success') => {
    const id = ++_id
    setToasts((p) => [...p, { id, message, type }])
  }
  const removeToast = (id) => setToasts((p) => p.filter((t) => t.id !== id))
  return { toasts, addToast, removeToast }
}
