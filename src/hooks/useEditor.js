// The single source of truth for one room's editor.
// The UI panels AND the 3D scene both read this state, so they can never disagree.
import { useReducer, useEffect, useRef, useCallback, useState } from 'react'
import { createDefaultDesign, normalize, newUid, sameDesign } from '../utils/design.js'
import { loadDesign, saveDesign, clearDesign } from '../utils/storage.js'
import { THEMES } from '../data/palette.js'
import { getDef } from '../data/catalog.js'
import { ROT_STEP, clampFloor } from '../utils/placement.js'

const HISTORY_LIMIT = 60

function init(roomId) {
  const saved = loadDesign(roomId)
  return {
    roomId,
    design: saved || createDefaultDesign(roomId),
    restored: !!saved,
    past: [],
    future: [],
    pending: null, // design before a drag started (so a whole drag = one undo step)
    selected: null,
    placing: null, // catalog id being placed
  }
}

const commit = (s, design) => ({
  ...s,
  design: normalize(s.roomId, design),
  past: [...s.past, s.design].slice(-HISTORY_LIMIT),
  future: [],
  pending: null,
})

function reducer(s, a) {
  const d = s.design
  switch (a.type) {
    case 'select':
      return { ...s, selected: a.uid, placing: null }
    case 'startPlace':
      return { ...s, placing: a.id, selected: null }
    case 'cancelPlace':
      return { ...s, placing: null }

    case 'add': {
      const item = { uid: a.uid, ...a.item }
      return { ...commit(s, { ...d, furniture: [...d.furniture, item] }), selected: a.uid, placing: null }
    }

    case 'moveLive': {
      const base = s.pending || d
      const target = d.furniture.find((f) => f.uid === a.uid)
      if (!target) return s
      const def = getDef(target.id)
      let patch = a.patch
      // Clamp floor items first, so anything resting on them follows the final position
      if (def.kind === 'floor') {
        patch = { ...patch, ...clampFloor(def, patch.x ?? target.x, patch.z ?? target.z, target.rot || 0) }
      }
      const dx = patch.x != null ? patch.x - target.x : 0
      const dz = patch.z != null ? patch.z - target.z : 0
      const furniture = d.furniture.map((f) => {
        if (f.uid === a.uid) return { ...f, ...patch }
        if (f.parent === a.uid) return { ...f, x: f.x + dx, z: f.z + dz } // items on a table travel with it
        return f
      })
      return { ...s, design: normalize(s.roomId, { ...d, furniture }), pending: base }
    }
    case 'moveEnd': {
      if (!s.pending) return s
      if (sameDesign(s.pending, s.design)) return { ...s, pending: null }
      return { ...s, past: [...s.past, s.pending].slice(-HISTORY_LIMIT), future: [], pending: null }
    }

    case 'rotate': {
      const t = d.furniture.find((f) => f.uid === a.uid)
      const def = t && getDef(t.id)
      if (!t || def.kind === 'wall') return s
      const ang = a.dir * ROT_STEP
      const c = Math.cos(ang)
      const sn = Math.sin(ang)
      const furniture = d.furniture.map((f) => {
        if (f.uid === t.uid) return { ...f, rot: (f.rot || 0) + ang }
        if (f.parent === t.uid) {
          const rx = f.x - t.x
          const rz = f.z - t.z
          return { ...f, x: t.x + rx * c + rz * sn, z: t.z - rx * sn + rz * c, rot: (f.rot || 0) + ang }
        }
        return f
      })
      return commit(s, { ...d, furniture })
    }

    case 'remove': {
      const next = commit(s, { ...d, furniture: d.furniture.filter((f) => f.uid !== a.uid) })
      return { ...next, selected: null }
    }

    case 'replace': {
      const t = d.furniture.find((f) => f.uid === a.uid)
      if (!t) return s
      const newDef = getDef(a.id)
      const oldDef = getDef(t.id)
      if (!newDef || newDef.kind !== oldDef.kind) return s
      const furniture = d.furniture.map((f) => (f.uid === a.uid ? { ...f, id: a.id } : f))
      return commit(s, { ...d, furniture })
    }

    case 'setWalls': return commit(s, { ...d, walls: a.id, theme: null })
    case 'setFloor': return commit(s, { ...d, floor: a.id, theme: null })
    case 'setLighting': return commit(s, { ...d, lighting: a.id, theme: null })
    case 'setTheme': {
      const th = THEMES.find((x) => x.id === a.id)
      if (!th) return s
      return commit(s, { ...d, walls: th.walls, floor: th.floor, lighting: th.lighting, theme: th.id })
    }

    case 'undo': {
      if (s.pending || !s.past.length) return s
      const prev = s.past[s.past.length - 1]
      return { ...s, design: prev, past: s.past.slice(0, -1), future: [d, ...s.future], selected: prev.furniture.some((f) => f.uid === s.selected) ? s.selected : null, placing: null }
    }
    case 'redo': {
      if (s.pending || !s.future.length) return s
      const [next, ...rest] = s.future
      return { ...s, design: next, future: rest, past: [...s.past, d], selected: next.furniture.some((f) => f.uid === s.selected) ? s.selected : null, placing: null }
    }

    case 'reset':
      return { ...commit(s, createDefaultDesign(s.roomId)), selected: null, placing: null }
    case 'clear':
      return { ...commit(s, { ...d, furniture: [] }), selected: null, placing: null }
    default:
      return s
  }
}

export function useEditor(roomId) {
  const [state, dispatch] = useReducer(reducer, roomId, init)
  const [savedAt, setSavedAt] = useState(null)
  const [saveFailed, setSaveFailed] = useState(false)
  const firstRun = useRef(true)

  const saveNow = useCallback(() => {
    const ok = saveDesign(roomId, state.design)
    setSaveFailed(!ok)
    if (ok) setSavedAt(Date.now())
    return ok
  }, [roomId, state.design])

  // Autosave shortly after every committed change (not in the middle of a drag).
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    if (state.pending) return
    const t = setTimeout(() => {
      const ok = saveDesign(roomId, state.design)
      setSaveFailed(!ok)
      if (ok) setSavedAt(Date.now())
    }, 500)
    return () => clearTimeout(t)
  }, [state.design, state.pending, roomId])

  const actions = {
    select: (uid) => dispatch({ type: 'select', uid }),
    startPlace: (id) => dispatch({ type: 'startPlace', id }),
    cancelPlace: () => dispatch({ type: 'cancelPlace' }),
    add: (item) => {
      const uid = newUid()
      dispatch({ type: 'add', uid, item })
      return uid
    },
    moveLive: (uid, patch) => dispatch({ type: 'moveLive', uid, patch }),
    moveEnd: () => dispatch({ type: 'moveEnd' }),
    rotate: (uid, dir) => dispatch({ type: 'rotate', uid, dir }),
    remove: (uid) => dispatch({ type: 'remove', uid }),
    replace: (uid, id) => dispatch({ type: 'replace', uid, id }),
    setWalls: (id) => dispatch({ type: 'setWalls', id }),
    setFloor: (id) => dispatch({ type: 'setFloor', id }),
    setLighting: (id) => dispatch({ type: 'setLighting', id }),
    setTheme: (id) => dispatch({ type: 'setTheme', id }),
    undo: () => dispatch({ type: 'undo' }),
    redo: () => dispatch({ type: 'redo' }),
    reset: () => dispatch({ type: 'reset' }),
    clear: () => dispatch({ type: 'clear' }),
    forgetSaved: () => clearDesign(roomId),
  }

  return { state, actions, saveNow, savedAt, saveFailed }
}
