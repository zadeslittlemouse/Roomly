// Pure placement maths: keeping furniture inside the room, on tables and on walls.
// No React or Three.js here, which makes it easy to read and test.
import { ROOM_SIZE } from '../rooms/rooms.js'

const { W, D } = ROOM_SIZE
export const WALL_T = 0.12 // wall thickness (outside the room)
export const STEP = 0.05 // snapping grid, metres
export const ROT_STEP = Math.PI / 4 // rotate in 45 degree steps

export const snap = (v, step = STEP) => Math.round(v / step) * step
export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

// Half-size of the axis-aligned box that contains a w x d rectangle rotated by `rot`.
export function halfExtents(w, d, rot) {
  const c = Math.abs(Math.cos(rot))
  const s = Math.abs(Math.sin(rot))
  return { hx: (c * w) / 2 + (s * d) / 2, hz: (s * w) / 2 + (c * d) / 2 }
}

// Keep a floor item completely inside the four room walls.
export function clampFloor(def, x, z, rot) {
  const { hx, hz } = halfExtents(def.size[0], def.size[1], rot)
  return {
    x: clamp(x, -W / 2 + hx, W / 2 - hx),
    z: clamp(z, -D / 2 + hz, D / 2 - hz),
  }
}

// Convert a world x/z into an item's own local frame (item centre = origin).
export function toLocal(item, x, z) {
  const dx = x - item.x
  const dz = z - item.z
  const c = Math.cos(item.rot)
  const s = Math.sin(item.rot)
  return { lx: dx * c - dz * s, lz: dx * s + dz * c }
}
export function toWorld(item, lx, lz) {
  const c = Math.cos(item.rot)
  const s = Math.sin(item.rot)
  return { x: item.x + lx * c + lz * s, z: item.z - lx * s + lz * c }
}

// Is a world point above the table's top surface?
export function overSurface(tableItem, tableDef, x, z) {
  const { lx, lz } = toLocal(tableItem, x, z)
  return Math.abs(lx) <= tableDef.size[0] / 2 && Math.abs(lz) <= tableDef.size[1] / 2
}

// Keep a small item (lamp, book...) fully on a tabletop.
export function clampOnSurface(tableItem, tableDef, itemDef, x, z) {
  const { lx, lz } = toLocal(tableItem, x, z)
  const mx = Math.max(0, tableDef.size[0] / 2 - itemDef.size[0] / 2 - 0.02)
  const mz = Math.max(0, tableDef.size[1] / 2 - itemDef.size[1] / 2 - 0.02)
  return toWorld(tableItem, clamp(lx, -mx, mx), clamp(lz, -mz, mz))
}

/* ---------- Walls ---------- */

// Where does wall art sit in 3D? Back wall faces +Z, left wall faces +X.
export function wallPose(wall, u, y, depth = 0) {
  const off = 0.02 + depth / 2 // push deep items (cabinets) out so their back touches the wall
  if (wall === 'left') return { position: [-W / 2 + off, y, u], rotY: Math.PI / 2 }
  return { position: [u, y, -D / 2 + off], rotY: 0 }
}

// Wall art slides along the wall; keep it inside the corners.
export function clampWall(def, wall, u) {
  const half = def.size[0] / 2 + 0.1
  return wall === 'left' ? clamp(u, -D / 2 + half, D / 2 - half) : clamp(u, -W / 2 + half, W / 2 - half)
}

// Wall art may not cover the window.
export function overlapsWindow(room, def, wall, u, y) {
  const win = room.window
  if (!win || win.wall !== wall) return false
  const hw = def.size[0] / 2
  const hh = def.size[1] / 2
  const winL = win.u - win.width / 2
  const winR = win.u + win.width / 2
  const horizontal = u + hw > winL - 0.05 && u - hw < winR + 0.05
  const vertical = y + hh > win.bottom - 0.05 && y - hh < win.top + 0.05
  return horizontal && vertical
}
