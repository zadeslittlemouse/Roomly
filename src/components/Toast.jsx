export default function Toast({ toast, onAction }) {
  if (!toast) return null
  return (
    <div className="toast" role="status" aria-live="polite">
      <span>{toast.message}</span>
      {toast.actionLabel && <button className="toast-action" onClick={onAction}>{toast.actionLabel}</button>}
    </div>
  )
}
