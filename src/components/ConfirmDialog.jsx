import { useEffect, useRef } from 'react'

export default function ConfirmDialog({ title, body, confirmLabel, onConfirm, onCancel }) {
  const ref = useRef(null)
  useEffect(() => {
    ref.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" role="alertdialog" aria-modal="true" aria-labelledby="dlg-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="dlg-title">{title}</h2>
        <p>{body}</p>
        <div className="row row-end">
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" ref={ref} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
