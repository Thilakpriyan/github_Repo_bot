export default function EmptyState({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <div className="text-4xl mb-3 opacity-30">{icon}</div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
      {description && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs">{description}</p>
      )}
    </div>
  )
}
