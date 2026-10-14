import { useEffect, useRef, useState } from 'react'

// Tells you when an element is on screen (used to start animations and pause the 3D hero).
export function useInView({ once = false, threshold = 0.15 } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') { setInView(true); return }
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting && once) io.disconnect()
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [once, threshold])
  return [ref, inView]
}

// Counts up from 0 to `target` once `active` becomes true.
export function useCountUp(target, active, ms = 1400) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setValue(target); return }
    let raf
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / ms, 1)
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, active, ms])
  return value
}
