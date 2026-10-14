import { useEffect, useState } from 'react'

export default function SaveIndicator({ savedAt, failed }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!savedAt) return
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 2200)
    return () => clearTimeout(t)
  }, [savedAt])
  if (failed) return <span className="save-indicator is-error" role="status">Could not save in this browser</span>
  return (
    <span className={`save-indicator ${visible ? 'is-on' : ''}`} role="status" aria-live="polite">
      {visible ? 'Saved in this browser' : ''}
    </span>
  )
}
