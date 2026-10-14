// A "design" is everything that gets saved for one room:
//   { furniture: [...], walls, floor, lighting, theme }
// Furniture entries: { uid, id, x, z, rot }  (floor items)
//                    { uid, id, x, z, rot, parent }  (items resting on a table)
//                    { uid, id, wall, u }  (wall art)
import { ROOMS } from '../rooms/rooms.js'
import { getDef } from '../data/catalog.js'
import { WALLS, FLOORS, LIGHTING, THEMES } from '../data/palette.js'
import { clampFloor, clampOnSurface, clampWall, overlapsWindow, snap } from './placement.js'

let counter = 0
export const newUid = () => `f${Date.now().toString(36)}${(counter++).toString(36)}`

export function createDefaultDesign(roomId) {
  const room = ROOMS[roomId]
  const keyToUid = {}
  const withUid = room.defaults.furniture.map((f) => {
    const uid = newUid()
    if (f.key) keyToUid[f.key] = uid
    return { ...f, uid }
  })
  const furniture = withUid.map(({ key, parent, ...rest }) => (parent ? { ...rest, parent: keyToUid[parent] } : rest))
  const d = room.defaults
  return normalize(roomId, { furniture, walls: d.walls, floor: d.floor, lighting: d.lighting, theme: d.theme })
}

// Make sure every item obeys the rules (inside the room, on its table, etc).
// Called after every change so the scene can never end up in an invalid state.
export function normalize(roomId, design) {
  const room = ROOMS[roomId]
  const byUid = new Map(design.furniture.map((f) => [f.uid, f]))
  const out = []
  for (const f of design.furniture) {
    const def = getDef(f.id)
    if (!def) continue
    if (def.kind === 'floor') {
      const rot = f.rot || 0
      const { x, z } = clampFloor(def, f.x ?? 0, f.z ?? 0, rot)
      out.push({ uid: f.uid, id: f.id, x, z, rot })
    } else if (def.kind === 'top') {
      const parent = byUid.get(f.parent)
      const pdef = parent && getDef(parent.id)
      if (!pdef || pdef.surface == null) continue // its table is gone, so it goes too
      const p = clampOnSurface(parent, pdef, def, f.x, f.z)
      out.push({ uid: f.uid, id: f.id, x: p.x, z: p.z, rot: f.rot ?? parent.rot ?? 0, parent: f.parent })
    } else {
      const wall = f.wall === 'left' ? 'left' : 'back'
      let u = clampWall(def, wall, f.u ?? 0)
      if (overlapsWindow(room, def, wall, u, def.wallY)) continue
      out.push({ uid: f.uid, id: f.id, wall, u })
    }
  }
  // tables may have been dropped after their children were processed; run a second pass
  const uids = new Set(out.map((f) => f.uid))
  const cleaned = out.filter((f) => !f.parent || uids.has(f.parent))
  return { ...design, furniture: cleaned }
}

// Read an unknown object (from localStorage) and rebuild a safe design from it.
export function sanitize(roomId, raw) {
  const fallback = createDefaultDesign(roomId)
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.furniture)) return null
  const furniture = raw.furniture
    .filter((f) => f && typeof f === 'object' && getDef(f.id) && typeof f.uid === 'string')
    .map((f) => ({
      uid: f.uid,
      id: f.id,
      x: Number.isFinite(f.x) ? f.x : 0,
      z: Number.isFinite(f.z) ? f.z : 0,
      rot: Number.isFinite(f.rot) ? f.rot : 0,
      wall: f.wall,
      u: Number.isFinite(f.u) ? f.u : 0,
      parent: f.parent,
    }))
  const pick = (list, id, fb) => (list.some((x) => x.id === id) ? id : fb)
  return normalize(roomId, {
    furniture,
    walls: pick(WALLS, raw.walls, fallback.walls),
    floor: pick(FLOORS, raw.floor, fallback.floor),
    lighting: pick(LIGHTING, raw.lighting, fallback.lighting),
    theme: THEMES.some((t) => t.id === raw.theme) ? raw.theme : null,
  })
}

export const sameDesign = (a, b) => JSON.stringify(strip(a)) === JSON.stringify(strip(b))
// uids are random per default design, so compare by content instead
function strip(d) {
  const idx = new Map(d.furniture.map((f, i) => [f.uid, i]))
  return {
    ...d,
    furniture: d.furniture
      .map((f) => ({ id: f.id, x: +f.x?.toFixed?.(2), z: +f.z?.toFixed?.(2), rot: f.rot, wall: f.wall, u: f.u, parent: idx.get(f.parent) }))
      .sort((a, b) => (a.id + a.x + a.z + a.u).localeCompare(b.id + b.x + b.z + b.u)),
  }
}
export { snap }
