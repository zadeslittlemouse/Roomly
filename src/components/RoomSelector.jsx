import { useEffect, useRef, useState } from 'react'
import { ROOMS, ROOM_ORDER } from '../rooms/rooms.js'
import { CATALOG } from '../data/catalog.js'
import { THEMES, LIGHTING, byId } from '../data/palette.js'
import { hasSaved } from '../utils/storage.js'
import { useInView, useCountUp } from '../hooks/useInView.js'
import RoomIllustration from './RoomIllustration.jsx'
import HeroScene from './HeroScene.jsx'

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const AUTOPLAY_MS = 6500

// The hero room cycles through these moods. `accent` also tints the glow of the whole page.
const MOODS = [
  { id: 'evening-glow', name: 'Evening Glow', blurb: 'Deep burgundy, lamps on', walls: 'burgundy', lighting: 'evening', accent: '#F2B35E' },
  ...THEMES.map((t) => ({
    ...t,
    accent: { 'soft-minimal': '#EBDDC4', 'vintage-romance': '#E8939B', 'sage-sanctuary': '#A9C799', 'warm-neutral': '#F0A860' }[t.id],
  })),
]

const WORDS = ['cozy', 'sunlit', 'moody', 'minimal', 'yours']
const MARQUEE = CATALOG.filter((c) => c.kind !== 'wall' || c.category === 'Wall Art').map((c) => c.name)
const ROW_A = MARQUEE.filter((_, i) => i % 2 === 0).slice(0, 26)
const ROW_B = MARQUEE.filter((_, i) => i % 2 === 1).slice(0, 26)

const STEPS = [
  { n: '1', title: 'Pick a room', text: 'Six rooms, each with its own furniture, from a window-lit bedroom to a sunset balcony.' },
  { n: '2', title: 'Place and play', text: 'Click to place, drag to move, turn, swap styles. Everything glides and pops into place.' },
  { n: '3', title: 'Set the mood', text: 'Try a theme, change the walls and floor, and slide from morning light to a lamp-lit evening.' },
]

/* ---------- small animated pieces ---------- */

// Intro: two velvet curtains part over the logo. Shown once per browser session.
function Splash({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div className="splash" aria-hidden="true">
      <i className="curtain l" />
      <i className="curtain r" />
      <span className="splash-logo">ROOMLY</span>
    </div>
  )
}

// A word that flips to the next one every couple of seconds.
function Rotator({ words }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduced()) return
    const t = setInterval(() => setI((n) => (n + 1) % words.length), 2300)
    return () => clearInterval(t)
  }, [words])
  return (
    <span className="rot-wrap">
      <span key={i} className="rot">{words[i]}</span>
    </span>
  )
}

// A button that leans toward the cursor and sends out a ripple when clicked.
function MagneticButton({ children, className = '', onClick }) {
  const ref = useRef(null)
  const move = (e) => {
    if (reduced()) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) * 0.22
    const y = (e.clientY - (r.top + r.height / 2)) * 0.3
    ref.current.style.transform = `translate(${x}px, ${y}px)`
  }
  const leave = () => { ref.current.style.transform = '' }
  const click = (e) => {
    const r = ref.current.getBoundingClientRect()
    const rip = document.createElement('span')
    rip.className = 'ripple'
    rip.style.left = `${e.clientX - r.left}px`
    rip.style.top = `${e.clientY - r.top}px`
    rip.onanimationend = () => rip.remove()
    ref.current.appendChild(rip)
    onClick?.(e)
  }
  return (
    <button ref={ref} className={`btn btn-lg magnetic ${className}`} onPointerMove={move} onPointerLeave={leave} onClick={click}>
      {children}
    </button>
  )
}

// Decorative outlines of furniture that drift and shift slightly with the mouse.
const ICONS = {
  lamp: <path d="M20 8h24l8 22H12zM32 30v22M20 56h24" />,
  plant: <path d="M20 56h24l-3-14H23zM32 42V22M32 30c-10 0-14-8-14-14 8 0 14 4 14 14zM32 26c8 0 12-6 12-12-8 0-12 4-12 12z" />,
  chair: <path d="M18 8v30h28V8M14 38h36M20 38v18M44 38v18M18 22h28" />,
  frame: <path d="M10 10h44v44H10zM18 18h28v28H18zM18 46l10-12 8 8 6-6 4 10" />,
  cactus: <path d="M24 56h16l-2-10H26zM32 46V14a4 4 0 018 0v8M32 36h-8a4 4 0 01-4-4V24M32 32h8" />,
  bed: <path d="M6 44V18M6 36h52v8M58 44v-8M14 36v-8a4 4 0 014-4h12a4 4 0 014 4v8" />,
}
const FLOATERS = [
  { k: 'lamp', x: '4%', y: '14%', s: 74, d: 14, r: -8 },
  { k: 'plant', x: '90%', y: '9%', s: 66, d: -18, r: 10 },
  { k: 'frame', x: '47%', y: '4%', s: 58, d: 10, r: 6 },
  { k: 'chair', x: '2%', y: '70%', s: 70, d: -12, r: -6 },
  { k: 'cactus', x: '93%', y: '62%', s: 60, d: 16, r: 8 },
  { k: 'bed', x: '48%', y: '90%', s: 84, d: -10, r: -3 },
]

function Stat({ value, label, active }) {
  const n = useCountUp(value, active)
  return (
    <div className="stat">
      <strong>{n}</strong>
      <span>{label}</span>
    </div>
  )
}

function RoomCard({ id, index, onOpen }) {
  const room = ROOMS[id]
  const [ref, seen] = useInView({ once: true })
  const tilt = (e) => {
    if (reduced()) return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${(-y * 9).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(x * 11).toFixed(2)}deg`)
    el.style.setProperty('--mx', `${(x + 0.5) * 100}%`)
    el.style.setProperty('--my', `${(y + 0.5) * 100}%`)
  }
  const reset = (e) => {
    e.currentTarget.style.setProperty('--rx', '0deg')
    e.currentTarget.style.setProperty('--ry', '0deg')
  }
  return (
    <li ref={ref} className={`reveal ${seen ? 'is-seen' : ''}`} style={{ '--d': `${index * 110}ms` }}>
      <button className="room-card" onClick={() => onOpen(id)} onPointerMove={tilt} onPointerLeave={reset} aria-label={`${room.name}, ${room.catalogIds.length} pieces`}>
        <span className="card-border" aria-hidden="true" />
        <span className="card-glow" aria-hidden="true" />
        <RoomIllustration roomId={id} />
        <span className="room-card-body">
          <span>
            <span className="room-card-name">{room.name}</span>
            <span className="room-card-sub">{room.catalogIds.length} pieces</span>
          </span>
          <span className="pill pill-go">{hasSaved(id) ? 'Continue' : 'Open'} <i aria-hidden="true">&rarr;</i></span>
        </span>
      </button>
    </li>
  )
}

/* ---------- the page ---------- */

export default function RoomSelector({ onOpen }) {
  const [moodIndex, setMoodIndex] = useState(0)
  const [auto, setAuto] = useState(true)
  const [splash, setSplash] = useState(() => {
    try { return !reduced() && !sessionStorage.getItem('roomly:splash') } catch { return false }
  })
  const resume = useRef(null)
  const wrap = useRef(null)
  const hero = useRef(null)
  const sparks = useRef(null)
  const lastSpark = useRef(0)
  const mood = MOODS[moodIndex]
  const [statsRef, statsSeen] = useInView({ once: true })
  const [stepsRef, stepsSeen] = useInView({ once: true })

  const finishSplash = () => {
    try { sessionStorage.setItem('roomly:splash', '1') } catch { /* ignore */ }
    setSplash(false)
  }

  // the hero mood advances every few seconds until the visitor picks one
  useEffect(() => {
    if (!auto) return
    const t = setTimeout(() => setMoodIndex((i) => (i + 1) % MOODS.length), AUTOPLAY_MS)
    return () => clearTimeout(t)
  }, [auto, moodIndex])
  useEffect(() => () => clearTimeout(resume.current), [])

  // scroll progress + parallax value, written straight to CSS variables (no React re-render)
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = wrap.current
        if (!el) return
        const max = document.documentElement.scrollHeight - window.innerHeight
        el.style.setProperty('--sp', max > 0 ? (window.scrollY / max).toFixed(4) : '0')
        el.style.setProperty('--sy', String(window.scrollY))
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  // cursor spotlight, mouse parallax and a sparkle trail over the hero
  const onPointerMove = (e) => {
    const el = wrap.current
    if (!el || e.pointerType === 'touch') return
    el.style.setProperty('--px', `${e.clientX}px`)
    el.style.setProperty('--py', `${e.clientY}px`)
    el.style.setProperty('--mx', (e.clientX / window.innerWidth).toFixed(3))
    el.style.setProperty('--my', (e.clientY / window.innerHeight).toFixed(3))
    if (reduced() || !hero.current || !sparks.current) return
    const now = performance.now()
    if (now - lastSpark.current < 55) return
    const hr = hero.current.getBoundingClientRect()
    if (e.clientY < hr.top || e.clientY > hr.bottom) return
    lastSpark.current = now
    const s = document.createElement('i')
    s.className = 'spark'
    s.style.left = `${e.clientX}px`
    s.style.top = `${e.clientY}px`
    s.style.setProperty('--dx', `${(Math.random() - 0.5) * 50}px`)
    s.style.setProperty('--dy', `${20 + Math.random() * 40}px`)
    s.onanimationend = () => s.remove()
    if (sparks.current.children.length > 26) sparks.current.firstChild.remove()
    sparks.current.appendChild(s)
  }

  const tiltHero = (e) => {
    if (reduced()) return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty('--tx', `${(-((e.clientY - r.top) / r.height - 0.5) * 7).toFixed(2)}deg`)
    el.style.setProperty('--ty', `${(((e.clientX - r.left) / r.width - 0.5) * 9).toFixed(2)}deg`)
  }
  const untiltHero = (e) => {
    e.currentTarget.style.setProperty('--tx', '0deg')
    e.currentTarget.style.setProperty('--ty', '0deg')
  }

  const pick = (i) => {
    setMoodIndex(i)
    setAuto(false)
    clearTimeout(resume.current)
    resume.current = setTimeout(() => setAuto(true), 14000)
  }
  const startHere = () => document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' })
  const light = byId(LIGHTING, mood.lighting)

  return (
    <div className="home-wrap" ref={wrap} style={{ '--accent': mood.accent, '--base': splash ? '2.1s' : '0s' }} onPointerMove={onPointerMove}>
      {splash && <Splash onDone={finishSplash} />}
      <div className="scroll-bar" aria-hidden="true" />
      <div className="spotlight" aria-hidden="true" />
      <div className="sparks" ref={sparks} aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="bg-blobs" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="floaters" aria-hidden="true">
        {FLOATERS.map((f, i) => (
          <svg key={f.k} className="floater" viewBox="0 0 64 64" style={{ left: f.x, top: f.y, width: f.s, height: f.s, '--d': `${f.d}`, '--r': `${f.r}deg`, '--i': i }}>
            {ICONS[f.k]}
          </svg>
        ))}
      </div>

      <div className="home">
        <header className="hero" ref={hero}>
          <div className="hero-copy">
            <span className="brand">ROOMLY</span>
            <h1 aria-label="Your space. Your story.">
              <span className="word" style={{ '--i': 0 }}>Your&nbsp;</span>
              <span className="word" style={{ '--i': 1 }}>space.&nbsp;</span>
              <br />
              <span className="word" style={{ '--i': 2 }}>Your&nbsp;</span>
              <span className="word grad" style={{ '--i': 3 }}>story.</span>
            </h1>
            <p className="hero-sub">A little rearranging can change everything.</p>
            <p className="hero-make" aria-label="Make it cozy, sunlit, moody, minimal or yours">
              Make it <Rotator words={WORDS} />
            </p>
            <div className="row hero-cta">
              <MagneticButton className="btn-accent btn-shine" onClick={startHere}>Start decorating</MagneticButton>
              <MagneticButton className="btn-ghost" onClick={() => onOpen('bedroom')}>Jump into the bedroom</MagneticButton>
            </div>
            <p className="hero-hint">Pick a mood. This Reading Room is live 3D and the page follows its light. Decorate any of the six rooms below.</p>
            <div className="mood-row" role="group" aria-label="Preview a mood">
              {MOODS.map((t, i) => (
                <button key={t.id} className={`mood ${i === moodIndex ? 'is-active' : ''}`} onClick={() => pick(i)} aria-pressed={i === moodIndex}>
                  <i className="mood-dot" style={{ background: t.accent }} />
                  {t.name}
                  {i === moodIndex && auto && <span key={moodIndex} className="mood-progress" style={{ animationDuration: `${AUTOPLAY_MS}ms` }} />}
                </button>
              ))}
            </div>
          </div>

          <div className="hero-visual" onPointerMove={tiltHero} onPointerLeave={untiltHero}>
            <div className="hero-tilt">
              <HeroScene mood={mood} />
              <span className="hero-tag">Preview room · not yet decorable</span>
              <div className="hero-badge" key={mood.id}>
                <strong>{mood.name}</strong>
                <span>The Reading Room · {light.name}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[0, 1].map((k) => <span key={k}>{ROW_A.map((n, i) => <em key={i}>{n}</em>)}</span>)}
          </div>
          <div className="marquee-track rev">
            {[0, 1].map((k) => <span key={k}>{ROW_B.map((n, i) => <em key={i}>{n}</em>)}</span>)}
          </div>
        </div>

        <section className="stats" ref={statsRef} aria-label="What is inside">
          <Stat value={ROOM_ORDER.length} label="rooms to decorate" active={statsSeen} />
          <Stat value={CATALOG.length} label="furniture pieces" active={statsSeen} />
          <Stat value={THEMES.length + 1} label="ready-made moods" active={statsSeen} />
          <Stat value={LIGHTING.length} label="times of day" active={statsSeen} />
        </section>

        <section id="rooms" className="gallery" aria-label="Choose a room">
          <h2 className="section-title"><span>Choose a room</span></h2>
          <ul className="gallery-grid">
            {ROOM_ORDER.map((id, i) => <RoomCard key={id} id={id} index={i} onOpen={onOpen} />)}
          </ul>
        </section>

        <section className="steps" ref={stepsRef} aria-label="How it works">
          <h2 className="section-title"><span>How it works</span></h2>
          <ol className={`steps-grid ${stepsSeen ? 'is-seen' : ''}`}>
            <svg className="steps-line" viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true"><path d="M0 2H100" /></svg>
            {STEPS.map((s, i) => (
              <li key={s.n} style={{ '--d': `${i * 200}ms` }}>
                <span className="step-n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="cta-band" aria-label="Start">
          <h2>Ready to <span className="grad">rearrange</span>?</h2>
          <p>Your first room is one click away. Everything saves on this device.</p>
          <MagneticButton className="btn-accent btn-shine" onClick={() => onOpen('bedroom')}>Open the bedroom</MagneticButton>
        </section>

        <footer className="home-foot">
          <p className="fine-print">Designs are saved in this browser only. There are no accounts and nothing is uploaded.</p>
        </footer>
      </div>
    </div>
  )
}
