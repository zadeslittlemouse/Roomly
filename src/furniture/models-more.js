// A second batch of furniture options for every room. Same rules as models.js:
// origin = centre of footprint on the floor, front faces +Z (wall items: centred, facing +Z).
import * as THREE from 'three'
import { BRAND } from '../data/palette.js'
import { mat, box, rbox, cyl, sphere, group } from '../utils/three-helpers.js'
import { wood, fabric, metal, glowShade, markShade, pot, bedBase } from './models.js'
import { sofaBase } from './models-rooms.js'
import { makeArtCanvas } from './art.js'

const { ivory, cream, rose, sage, burgundy, walnut, charcoal } = BRAND
const OAK = '#C9A27A'
const PAINT = '#F2ECE2'
const RATTAN = '#C8A878'
const LEAF = '#7F9172'
const LEAF_DARK = '#5F7655'
const BLUE = '#8FA3B4'
const BOOKS = [burgundy, sage, cream, rose, '#C9B9A2', charcoal, '#7B8FA0']

const ownMat = (mesh) => { mesh.userData.ownMaterial = true; return mesh }
const rotated = (mesh, x = 0, y = 0, z = 0) => { mesh.rotation.set(x, y, z); return mesh }

function bookRow(g, w, y, z, seed = 0) {
  let x = -w / 2 + 0.03
  let i = seed
  while (x < w / 2 - 0.08) {
    const bw = 0.028 + ((i * 7) % 4) * 0.01
    const bh = 0.15 + ((i * 5) % 4) * 0.03
    g.add(box(bw, bh, 0.15, fabric(BOOKS[i % BOOKS.length]), x + bw / 2, y + bh / 2, z))
    x += bw + 0.005
    i++
  }
}

/* -------------------------------- BEDS -------------------------------- */

function bedCanopy() {
  const g = bedBase({ frameC: PAINT, headC: PAINT, duvetC: cream, headH: 1.0, headType: 'panel' })
  ;[[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => g.add(box(0.06, 2.0, 0.06, wood(PAINT), sx * 0.82, 1.0, sz * 1.02)))
  g.add(box(1.7, 0.05, 0.05, wood(PAINT), 0, 2.0, -1.02))
  g.add(box(1.7, 0.05, 0.05, wood(PAINT), 0, 2.0, 1.02))
  ;[-1, 1].forEach((s) => {
    g.add(box(0.05, 0.05, 2.1, wood(PAINT), s * 0.82, 2.0, 0))
    const sheer = box(0.01, 1.35, 2.0, mat(ivory, { rough: 1, opacity: 0.35 }), s * 0.82, 1.3, 0)
    sheer.castShadow = false
    g.add(sheer)
  })
  return g
}
const bedSingle = () => {
  const g = bedBase({ frameC: OAK, headC: OAK, duvetC: '#C9B9A2', headH: 0.85, headType: 'slats' })
  g.scale.set(0.66, 1, 1)
  return g
}
const bedDaybed = () => {
  const g = bedBase({ frameC: charcoal, headC: charcoal, duvetC: burgundy, headH: 0.9, headType: 'slats' })
  g.scale.set(0.62, 1, 1)
  return g
}

/* ------------------------------- TABLES ------------------------------- */

function tableTripod() {
  const g = group()
  g.add(cyl(0.25, 0.25, 0.03, wood(OAK), 0, 0.52, 0, 32))
  ;[0, 1, 2].forEach((i) => {
    const a = (i / 3) * Math.PI * 2
    const leg = cyl(0.015, 0.02, 0.52, wood(walnut), Math.sin(a) * 0.12, 0.26, Math.cos(a) * 0.12, 8)
    leg.rotation.z = -Math.sin(a) * 0.2
    leg.rotation.x = Math.cos(a) * 0.2
    g.add(leg)
  })
  return g
}
const tableCube = () => group(rbox(0.42, 0.45, 0.42, 0.05, mat(sage, { rough: 0.6 }), 0, 0.225, 0), box(0.3, 0.3, 0.02, mat('#7F9172', { rough: 0.7 }), 0, 0.22, 0.215))
function tableDrum() {
  const g = group()
  g.add(cyl(0.22, 0.22, 0.46, mat(charcoal, { rough: 0.5 }), 0, 0.23, 0, 32))
  g.add(cyl(0.23, 0.23, 0.03, metal(), 0, 0.485, 0, 32))
  g.add(cyl(0.23, 0.23, 0.02, metal(), 0, 0.01, 0, 32))
  return g
}

/* ------------------------------- SEATING ------------------------------- */

function chairBarrel() {
  const g = group()
  g.add(cyl(0.34, 0.3, 0.3, fabric(rose), 0, 0.15, 0, 28))
  g.add(cyl(0.3, 0.3, 0.12, fabric('#E6BFB9'), 0, 0.36, 0.02, 28))
  const mt = fabric(rose).clone()
  mt.side = THREE.DoubleSide
  const back = ownMat(new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.38, 0.55, 32, 1, true, Math.PI - 1.15, 2.3), mt))
  back.position.y = 0.58
  back.castShadow = true
  g.add(back)
  ;[0, 1, 2, 3].forEach((i) => {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4
    g.add(cyl(0.02, 0.015, 0.1, wood(walnut), Math.sin(a) * 0.25, 0.03, Math.cos(a) * 0.25, 8))
  })
  return g
}
function benchEnd() {
  const g = group()
  g.add(rbox(1.2, 0.16, 0.42, 0.06, fabric('#E3D6C2'), 0, 0.42, 0))
  g.add(box(1.14, 0.04, 0.38, wood(walnut), 0, 0.32, 0))
  ;[-0.54, 0.54].forEach((x) => g.add(box(0.05, 0.3, 0.36, wood(walnut), x, 0.15, 0)))
  return g
}
function chairBean() {
  const g = group()
  g.add(sphere(0.4, fabric(sage), 0, 0.26, 0, 1, 0.68, 1))
  g.add(sphere(0.3, fabric('#AEBBA0'), 0, 0.4, -0.08, 1, 0.5, 0.9))
  return g
}
function chairRocking() {
  const g = group()
  const w = wood(OAK)
  g.add(box(0.5, 0.04, 0.46, w, 0, 0.42, 0))
  ;[-0.22, 0.22].forEach((x) => {
    g.add(box(0.04, 0.38, 0.04, w, x, 0.23, 0.18))
    g.add(box(0.04, 0.5, 0.04, w, x, 0.7, -0.19)).children
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.016, 6, 28, 0.9), w)
    arc.castShadow = true
    arc.rotation.z = -Math.PI / 2 - 0.45
    const holder = group(arc)
    holder.rotation.y = Math.PI / 2
    holder.position.set(x, 0.92, 0)
    g.add(holder)
  })
  g.add(box(0.44, 0.08, 0.03, w, 0, 0.9, -0.19))
  g.add(box(0.44, 0.08, 0.03, w, 0, 0.72, -0.19))
  g.add(rbox(0.42, 0.04, 0.4, 0.02, fabric(cream), 0, 0.46, 0.01))
  return g
}
function chairWing() {
  const g = group()
  const f = fabric(BLUE)
  g.add(rbox(0.8, 0.28, 0.76, 0.06, f, 0, 0.3, 0.02))
  g.add(rbox(0.74, 0.8, 0.16, 0.08, f, 0, 0.82, -0.3))
  ;[-1, 1].forEach((s) => {
    g.add(rbox(0.12, 0.46, 0.7, 0.05, f, s * 0.34, 0.52, 0.02))
    g.add(rbox(0.12, 0.42, 0.3, 0.06, f, s * 0.34, 0.95, -0.2))
  })
  g.add(rbox(0.5, 0.1, 0.52, 0.05, fabric('#A5B6C4'), 0, 0.5, 0.08))
  ;[[-0.32, -0.28], [0.32, -0.28], [-0.32, 0.3], [0.32, 0.3]].forEach(([x, z]) => g.add(cyl(0.025, 0.018, 0.17, wood(walnut), x, 0.085, z, 8)))
  return g
}
const sofaChesterfield = () => sofaBase({ w: 2.0, color: '#7A4D58', cushion: '#8A5B66', cushions: 2 })
function ottoman() {
  const g = group()
  g.add(rbox(0.88, 0.36, 0.88, 0.1, fabric('#E3D6C2'), 0, 0.2, 0))
  g.add(cyl(0.3, 0.3, 0.02, wood(walnut), 0, 0.4, 0, 28))
  ;[[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => g.add(cyl(0.025, 0.02, 0.06, wood(walnut), sx * 0.36, 0.03, sz * 0.36, 8)))
  return g
}

/* -------------------------------- RUGS -------------------------------- */

function rugRunner() {
  const g = group()
  const parts = [box(0.8, 0.02, 2.4, fabric(burgundy), 0, 0.01, 0), box(0.6, 0.024, 2.2, fabric(cream), 0, 0.012, 0), box(0.4, 0.028, 2.0, fabric(rose), 0, 0.014, 0)]
  parts.forEach((p) => { p.castShadow = false; g.add(p) })
  return g
}
function rugChecker() {
  const g = group()
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) {
    const t = box(0.4, 0.02, 0.35, fabric((r + c) % 2 ? cream : sage), -0.8 + c * 0.4, 0.01, -0.525 + r * 0.35)
    t.castShadow = false
    g.add(t)
  }
  return g
}
function rugSmallRound() {
  const g = group()
  const a = cyl(0.6, 0.6, 0.02, fabric(rose), 0, 0.01, 0, 40)
  const b = cyl(0.42, 0.42, 0.024, fabric(ivory), 0, 0.012, 0, 40)
  const c = cyl(0.2, 0.2, 0.028, fabric(burgundy), 0, 0.014, 0, 40)
  ;[a, b, c].forEach((m) => { m.castShadow = false; g.add(m) })
  return g
}

/* ------------------------------- LIGHTING ------------------------------- */

function lampTripod() {
  const g = group()
  ;[0, 1, 2].forEach((i) => {
    const a = (i / 3) * Math.PI * 2
    const leg = cyl(0.014, 0.018, 1.45, wood(walnut), Math.sin(a) * 0.14, 0.72, Math.cos(a) * 0.14, 8)
    leg.rotation.z = -Math.sin(a) * 0.1
    leg.rotation.x = Math.cos(a) * 0.1
    g.add(leg)
  })
  const shade = cyl(0.17, 0.22, 0.26, glowShade(cream), 0, 1.55, 0, 28)
  markShade(shade, g)
  g.add(shade)
  return g
}
function lampGlobe() {
  const g = group()
  g.add(cyl(0.07, 0.08, 0.03, metal(), 0, 0.015, 0, 20))
  g.add(cyl(0.012, 0.012, 0.1, metal(), 0, 0.08, 0, 8))
  const globe = sphere(0.1, glowShade('#FFF4E0'), 0, 0.22, 0)
  markShade(globe, g)
  g.add(globe)
  return g
}
function lampMushroom() {
  const g = group()
  g.add(cyl(0.05, 0.07, 0.12, mat(cream, { rough: 0.4 }), 0, 0.06, 0, 18))
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), glowShade('#E9C7C0'))
  dome.position.y = 0.12
  dome.scale.y = 0.85
  markShade(dome, g)
  g.add(dome)
  return g
}
function lampPleated() {
  const g = group()
  g.add(cyl(0.06, 0.08, 0.2, mat('#B89A6A', { rough: 0.3, metal: 0.7 }), 0, 0.1, 0, 20))
  const shade = cyl(0.1, 0.17, 0.22, glowShade(cream), 0, 0.31, 0, 24)
  markShade(shade, g)
  g.add(shade)
  return g
}

/* -------------------------------- PLANTS -------------------------------- */

function plantMonstera() {
  const g = group()
  g.add(pot(0.2, 0.34, '#D8CBB8'))
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + 0.4
    const r = 0.14 + (i % 3) * 0.07
    const h = 0.7 + (i % 4) * 0.14
    g.add(cyl(0.008, 0.01, h, mat(LEAF_DARK), Math.sin(a) * r * 0.5, 0.34 + h / 2, Math.cos(a) * r * 0.5, 6))
    const leaf = sphere(0.2, mat(i % 2 ? LEAF : LEAF_DARK, { rough: 0.55 }), Math.sin(a) * r, 0.34 + h, Math.cos(a) * r, 1, 0.12, 0.8)
    leaf.rotation.set(0.3 * Math.cos(a), a, 0.3 * Math.sin(a))
    g.add(leaf)
  }
  return g
}
function plantPalm() {
  const g = group()
  g.add(pot(0.22, 0.32, '#B9775A'))
  g.add(cyl(0.025, 0.035, 1.1, wood('#7A5A42'), 0, 0.85, 0, 8))
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2
    const frond = sphere(0.3, mat(i % 2 ? LEAF : LEAF_DARK, { rough: 0.6 }), 0, 0, 0, 0.14, 0.03, 1)
    frond.rotation.set(0, a, 0)
    frond.rotation.x = 0.0
    const holder = group(frond)
    frond.position.set(0, 0, 0.28)
    holder.position.set(0, 1.45 - (i % 3) * 0.06, 0)
    holder.rotation.y = a
    frond.rotation.x = 0.5
    g.add(holder)
  }
  return g
}
function plantOlive() {
  const g = group()
  g.add(pot(0.22, 0.38, '#D8CBB8'))
  g.add(cyl(0.025, 0.04, 0.9, wood('#6B5A48'), 0, 0.8, 0, 8))
  for (let i = 0; i < 16; i++) {
    const a = i * 2.4
    const r = 0.12 + (i % 4) * 0.06
    g.add(sphere(0.1, mat(i % 2 ? '#8A9A7B' : '#9FAD90', { rough: 0.7 }), Math.sin(a) * r, 1.0 + (i % 5) * 0.12, Math.cos(a) * r, 1, 0.7, 1))
  }
  return g
}
function plantSucculents() {
  const g = group()
  ;[-0.09, 0, 0.09].forEach((x, k) => {
    g.add(cyl(0.035, 0.028, 0.05, mat(k % 2 ? '#B9775A' : PAINT, { rough: 0.8 }), x, 0.025, 0, 12))
    for (let j = 0; j < 6; j++) {
      const a = (j / 6) * Math.PI * 2
      g.add(sphere(0.02, mat(k === 1 ? '#8AA07A' : LEAF, { rough: 0.6 }), x + Math.sin(a) * 0.026, 0.07, Math.cos(a) * 0.026, 1, 1.6, 1))
    }
    g.add(sphere(0.022, mat(LEAF_DARK, { rough: 0.6 }), x, 0.075, 0))
  })
  return g
}

/* ----------------------------- WALL DECOR ----------------------------- */

function wallShelf() {
  const g = group()
  g.add(box(1.0, 0.035, 0.22, wood(walnut), 0, -0.1, 0))
  bookRow(g, 0.5, -0.082, 0, 3)
  g.add(pot(0.05, 0.1, '#B9775A').translateX(0.32).translateY(-0.08))
  g.add(sphere(0.07, mat(LEAF, { rough: 0.7 }), 0.32, 0.06, 0, 1, 0.9, 1))
  g.add(cyl(0.035, 0.03, 0.1, mat(cream, { rough: 0.3 }), 0.18, -0.03, 0, 14))
  return g
}
function wallClock() {
  const g = group()
  const rim = rotated(cyl(0.25, 0.25, 0.045, wood(walnut), 0, 0, 0, 40), Math.PI / 2)
  g.add(rim)
  const face = rotated(cyl(0.22, 0.22, 0.05, mat(ivory, { rough: 0.5 }), 0, 0, 0.002, 40), Math.PI / 2)
  face.castShadow = false
  g.add(face)
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2
    g.add(box(0.012, i % 3 ? 0.025 : 0.045, 0.01, mat(charcoal), Math.sin(a) * 0.185, Math.cos(a) * 0.185, 0.03)).children
      .at(-1).rotation.z = -a
  }
  const h1 = box(0.014, 0.12, 0.01, mat(charcoal), 0.03, 0.04, 0.036)
  h1.rotation.z = -0.9
  const h2 = box(0.01, 0.18, 0.01, mat(burgundy), -0.05, 0.05, 0.04)
  h2.rotation.z = 0.7
  g.add(h1, h2)
  return g
}
function wallSunburst() {
  const g = group()
  const glass = rotated(cyl(0.26, 0.26, 0.03, mat('#DCE5E8', { rough: 0.05, metal: 0.55 }), 0, 0, 0.0, 36), Math.PI / 2)
  glass.castShadow = false
  g.add(glass)
  const ring = rotated(cyl(0.29, 0.29, 0.025, metal('#B89A6A'), 0, 0, -0.004, 36), Math.PI / 2)
  g.add(ring)
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2
    const ray = box(0.025, 0.18, 0.015, metal('#B89A6A'), Math.sin(a) * 0.38, Math.cos(a) * 0.38, 0)
    ray.rotation.z = -a
    g.add(ray)
  }
  return g
}
function pinboard() {
  const g = group()
  g.add(box(0.9, 0.6, 0.035, wood(walnut), 0, 0, 0))
  g.add(box(0.84, 0.54, 0.04, mat('#C9A27A', { rough: 1 }), 0, 0, 0.002))
  ;[[-0.25, 0.1, rose, 0.1], [0.05, 0.12, cream, -0.08], [0.28, -0.05, sage, 0.05], [-0.1, -0.12, ivory, -0.12]].forEach(([x, y, c, r]) => {
    const note = box(0.18, 0.14, 0.006, mat(c, { rough: 0.9 }), x, y, 0.025)
    note.rotation.z = r
    g.add(note)
    g.add(sphere(0.012, mat(burgundy), x, y + 0.05, 0.03))
  })
  return g
}
function rangeHood() {
  const g = group()
  g.add(box(0.9, 0.14, 0.45, metal('#C9C5BE'), 0, -0.18, 0))
  const chim = box(0.34, 0.5, 0.26, metal('#C9C5BE'), 0, 0.14, -0.08)
  g.add(chim)
  g.add(box(0.7, 0.02, 0.35, mat(charcoal), 0, -0.26, 0.02))
  return g
}

/* -------------------------------- STORAGE -------------------------------- */

function chestTall() {
  const g = group()
  g.add(box(0.8, 1.15, 0.45, wood(walnut), 0, 0.6, 0))
  g.add(box(0.86, 0.04, 0.49, wood('#7A5A42'), 0, 1.19, 0))
  ;[0.14, 0.34, 0.54, 0.74, 0.94].forEach((y) => {
    g.add(box(0.72, 0.17, 0.015, wood('#9A7658'), 0, y + 0.06, 0.23))
    g.add(sphere(0.015, metal(), 0, y + 0.06, 0.245))
  })
  ;[[-0.34, -0.17], [0.34, -0.17], [-0.34, 0.17], [0.34, 0.17]].forEach(([x, z]) => g.add(cyl(0.025, 0.018, 0.04, wood('#6B4D38'), x, 0.02, z, 8)))
  return g
}
function trunk() {
  const g = group()
  g.add(box(0.9, 0.34, 0.45, wood('#7A5A42'), 0, 0.2, 0))
  g.add(box(0.94, 0.08, 0.49, wood(walnut), 0, 0.41, 0))
  ;[-0.38, 0.38].forEach((x) => g.add(box(0.05, 0.4, 0.5, metal('#B89A6A'), x, 0.22, 0)))
  g.add(box(0.1, 0.07, 0.02, metal('#B89A6A'), 0, 0.36, 0.235))
  ;[[-0.4, -0.2], [0.4, -0.2], [-0.4, 0.2], [0.4, 0.2]].forEach(([x, z]) => g.add(box(0.05, 0.04, 0.05, metal('#B89A6A'), x, 0.02, z)))
  return g
}
function cubeShelf() {
  const g = group()
  const w = wood(PAINT)
  g.add(box(0.8, 0.03, 0.35, w, 0, 0.015, 0))
  g.add(box(0.8, 0.03, 0.35, w, 0, 0.395, 0))
  g.add(box(0.8, 0.03, 0.35, w, 0, 0.785, 0))
  ;[-0.385, 0, 0.385].forEach((x) => g.add(box(0.03, 0.8, 0.35, w, x, 0.4, 0)))
  g.add(box(0.76, 0.8, 0.015, wood('#E4D9C6'), 0, 0.4, -0.17))
  g.add(rbox(0.3, 0.26, 0.28, 0.04, fabric(RATTAN), -0.19, 0.17, 0.02))
  g.add(rbox(0.3, 0.26, 0.28, 0.04, fabric(sage), 0.19, 0.55, 0.02))
  bookRow(g, 0.34, 0.03, 0, 5)
  return g
}
function shoeRack() {
  const g = group()
  const w = wood(OAK)
  ;[0.04, 0.26, 0.48, 0.7].forEach((y) => g.add(box(0.9, 0.025, 0.35, w, 0, y, 0)))
  ;[-0.43, 0.43].forEach((x) => g.add(box(0.03, 0.72, 0.35, w, x, 0.37, 0)))
  ;[0.065, 0.285, 0.505].forEach((y, r) => {
    for (let i = 0; i < 3; i++) {
      const shoe = rbox(0.1, 0.09, 0.26, 0.04, fabric([rose, charcoal, cream, burgundy, sage, '#C9B9A2'][(r * 3 + i) % 6]), -0.28 + i * 0.28, y + 0.045, 0.01)
      g.add(shoe)
    }
  })
  return g
}

/* --------------------------------- DECOR --------------------------------- */

function decorCandles() {
  const g = group()
  ;[[-0.05, 0.14, 0], [0.04, 0.1, 0.02], [0.0, 0.08, -0.03]].forEach(([x, h, z], i) => {
    g.add(cyl(0.025, 0.025, h, mat(i % 2 ? ivory : cream, { rough: 0.5 }), x, h / 2, z, 12))
    const flame = sphere(0.009, new THREE.MeshBasicMaterial({ color: '#FFD27A' }), x, h + 0.014, z, 1, 1.6, 1)
    flame.castShadow = false
    g.add(flame)
  })
  g.add(cyl(0.09, 0.09, 0.008, metal(), 0, 0.004, 0, 20))
  return g
}
function decorBasket() {
  const g = group()
  g.add(cyl(0.24, 0.2, 0.42, mat(RATTAN, { rough: 1 }), 0, 0.21, 0, 24))
  g.add(cyl(0.245, 0.245, 0.03, mat('#B89A6A', { rough: 1 }), 0, 0.42, 0, 24))
  g.add(rbox(0.3, 0.12, 0.26, 0.05, fabric(cream), 0, 0.47, 0)).children
  g.add(rbox(0.26, 0.08, 0.2, 0.04, fabric(rose), 0.04, 0.55, 0.02))
  return g
}
function decorGlobe() {
  const g = group()
  g.add(cyl(0.08, 0.09, 0.015, metal(), 0, 0.008, 0, 20))
  g.add(cyl(0.01, 0.01, 0.16, metal(), 0, 0.09, 0, 8))
  const ball = sphere(0.1, mat('#6F8F9A', { rough: 0.4 }), 0, 0.2, 0)
  ball.rotation.z = 0.4
  g.add(ball)
  ;[[0.04, 0.22, 0.08], [-0.06, 0.18, 0.06], [0.07, 0.15, -0.05]].forEach(([x, y, z]) => g.add(sphere(0.03, mat(sage, { rough: 0.7 }), x, y, z, 1, 0.5, 1)))
  return g
}
function decorFrames() {
  const g = group()
  ;[[-0.08, 0.2, 0.2, -0.15, ivory], [0.09, 0.15, 0.16, 0.12, walnut]].forEach(([x, h, w, tilt, c], i) => {
    const f = group(box(w, h, 0.015, wood(c), 0, h / 2, 0))
    const photo = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.03, h - 0.03), new THREE.MeshStandardMaterial({ color: i ? '#B89A8A' : '#9FB0A0', roughness: 0.9 }))
    ownMat(photo)
    photo.position.set(0, h / 2, 0.009)
    f.add(photo)
    f.position.set(x, 0, 0)
    f.rotation.x = -0.22
    f.rotation.z = tilt * 0.1
    g.add(f)
  })
  return g
}
function decorTray() {
  const g = group()
  g.add(box(0.4, 0.025, 0.26, wood(walnut), 0, 0.013, 0))
  ;[-1, 1].forEach((s) => g.add(box(0.4, 0.03, 0.015, wood('#7A5A42'), 0, 0.03, s * 0.125)))
  g.add(cyl(0.04, 0.035, 0.07, mat(cream, { rough: 0.3 }), -0.1, 0.065, 0, 16))
  g.add(cyl(0.05, 0.06, 0.1, mat(rose, { rough: 0.3 }), 0.08, 0.075, 0.02, 16))
  g.add(sphere(0.02, mat(burgundy), 0.08, 0.14, 0.02))
  return g
}
function blanketLadder() {
  const g = group()
  const w = wood(OAK)
  const tilt = group()
  ;[-0.26, 0.26].forEach((x) => tilt.add(box(0.04, 1.6, 0.04, w, x, 0.8, 0)))
  ;[0.25, 0.55, 0.85, 1.15, 1.45].forEach((y) => tilt.add(box(0.52, 0.03, 0.03, w, 0, y, 0)))
  tilt.add(box(0.5, 0.04, 0.1, fabric(cream), 0, 1.15, 0.03))
  tilt.add(box(0.5, 0.3, 0.05, fabric(rose), 0, 1.0, 0.04))
  tilt.add(box(0.5, 0.26, 0.05, fabric(sage), 0, 0.66, 0.04))
  tilt.rotation.x = -0.17
  tilt.position.z = 0.0
  g.add(tilt)
  return g
}

/* --------------------------- LIVING ROOM EXTRAS --------------------------- */

function tvUnit() {
  const g = group()
  g.add(box(1.6, 0.4, 0.42, wood(OAK), 0, 0.28, 0))
  ;[-0.52, 0, 0.52].forEach((x) => g.add(box(0.5, 0.3, 0.015, wood('#D6B48C'), x, 0.28, 0.215)))
  ;[[-0.74, -0.15], [0.74, -0.15], [-0.74, 0.15], [0.74, 0.15]].forEach(([x, z]) => g.add(cyl(0.025, 0.018, 0.08, wood(walnut), x, 0.04, z, 8)))
  g.add(box(1.2, 0.7, 0.04, mat('#222', { rough: 0.3 }), 0, 0.93, -0.05))
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.14, 0.64), new THREE.MeshStandardMaterial({ color: '#1B1E24', roughness: 0.15, metalness: 0.3 }))
  ownMat(scr)
  scr.position.set(0, 0.93, -0.028)
  g.add(scr)
  g.add(box(0.1, 0.2, 0.04, mat('#222'), 0, 0.58, -0.08))
  return g
}
function fireplace() {
  const g = group()
  const w = mat(PAINT, { rough: 0.6 })
  g.add(box(1.4, 1.0, 0.4, w, 0, 0.5, 0))
  g.add(box(1.52, 0.07, 0.46, wood(walnut), 0, 1.04, 0.02))
  g.add(box(0.7, 0.55, 0.05, mat('#2A2523', { rough: 0.9 }), 0, 0.42, 0.18))
  g.add(box(0.5, 0.08, 0.2, mat('#3A302B', { rough: 0.9 }), 0, 0.19, 0.2))
  ;[-0.14, 0, 0.14].forEach((x, i) => {
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.26 - i % 2 * 0.06, 8), new THREE.MeshBasicMaterial({ color: i === 1 ? '#FFB347' : '#FF8A3D' }))
    flame.position.set(x, 0.34, 0.2)
    g.add(flame)
  })
  g.add(box(0.8, 0.02, 0.1, wood('#6B4D38'), 0, 0.77, 0.19))
  return g
}

/* ------------------------------ STUDY EXTRAS ------------------------------ */

function shelfWide() {
  const g = group()
  const w = wood(OAK)
  ;[0.03, 0.4, 0.77, 1.1].forEach((y) => g.add(box(1.2, 0.035, 0.32, w, 0, y, 0)))
  ;[-0.58, 0, 0.58].forEach((x) => g.add(box(0.035, 1.1, 0.32, w, x, 0.55, 0)))
  g.add(box(1.16, 1.1, 0.015, wood('#B58E66'), 0, 0.55, -0.15))
  bookRow(g, 0.54, 0.05, 0, 1)
  bookRow(g, 0.54, 0.42, 0, 4)
  bookRow(g, 0.54, 0.79, 0, 2)
  g.add(rbox(0.24, 0.3, 0.2, 0.04, mat(rose, { rough: 0.6 }), 0.3, 0.2, 0.02))
  g.add(rbox(0.24, 0.24, 0.2, 0.04, mat(sage, { rough: 0.6 }), 0.3, 0.56, 0.02))
  return g
}
function easel() {
  const g = group()
  const w = wood(OAK)
  const legs = group()
  ;[-0.28, 0.28].forEach((x) => {
    const l = box(0.04, 1.7, 0.04, w, x, 0.85, 0.0)
    l.rotation.z = x < 0 ? -0.06 : 0.06
    legs.add(l)
  })
  const back = box(0.04, 1.7, 0.04, w, 0, 0.85, -0.28)
  back.rotation.x = 0.17
  legs.add(back)
  legs.add(box(0.6, 0.04, 0.04, w, 0, 0.5, 0.02))
  const tex = new THREE.CanvasTexture(makeArtCanvas('art-sun'))
  tex.colorSpace = THREE.SRGBColorSpace
  const canvasMesh = ownMat(new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.03), [mat(ivory), mat(ivory), mat(ivory), mat(ivory), new THREE.MeshStandardMaterial({ map: tex }), mat(ivory)]))
  canvasMesh.userData.ownMaterial = false
  canvasMesh.position.set(0, 0.88, 0.05)
  canvasMesh.rotation.x = -0.1
  canvasMesh.castShadow = true
  g.add(legs, canvasMesh)
  return g
}
function deskOrganizer() {
  const g = group()
  ;[[-0.06, 0.1, rose], [0.0, 0.12, burgundy], [0.06, 0.09, sage]].forEach(([x, h, c]) => {
    g.add(cyl(0.025, 0.025, h, mat(c, { rough: 0.5 }), x, h / 2, 0, 14))
    g.add(cyl(0.004, 0.004, h + 0.05, mat(charcoal), x + 0.01, h / 2 + 0.03, 0, 6))
  })
  return g
}

/* ------------------------------ KITCHEN EXTRAS ------------------------------ */

function fridge() {
  const g = group()
  const m = mat('#E9E4DA', { rough: 0.35 })
  g.add(box(0.76, 1.85, 0.7, m, 0, 0.93, 0))
  g.add(box(0.74, 0.02, 0.01, mat('#B9B4A8'), 0, 1.22, 0.355))
  g.add(box(0.025, 0.4, 0.03, metal('#C9C5BE'), 0.3, 1.5, 0.375))
  g.add(box(0.025, 0.6, 0.03, metal('#C9C5BE'), 0.3, 0.72, 0.375))
  g.add(box(0.7, 0.04, 0.6, mat('#B9B4A8'), 0, 0.02, 0))
  return g
}
function stoveCounter() {
  const g = group()
  g.add(box(1.2, 0.08, 0.58, wood('#4A3F38'), 0, 0.04, 0))
  g.add(box(1.2, 0.78, 0.58, mat('#C9A27A', { rough: 0.55 }), 0, 0.47, 0))
  g.add(box(1.24, 0.04, 0.64, mat('#2E2B29', { rough: 0.2 }), 0, 0.88, 0))
  ;[[-0.2, -0.12], [0.2, -0.12], [-0.2, 0.14], [0.2, 0.14]].forEach(([x, z]) => {
    g.add(cyl(0.09, 0.09, 0.01, mat('#111'), x, 0.905, z, 20))
    g.add(cyl(0.04, 0.04, 0.012, mat('#333'), x, 0.91, z, 16))
  })
  g.add(box(0.8, 0.5, 0.015, mat('#222', { rough: 0.2 }), 0, 0.42, 0.295))
  g.add(box(0.74, 0.03, 0.02, metal('#C9C5BE'), 0, 0.72, 0.31))
  ;[-0.3, -0.1, 0.1, 0.3].forEach((x) => g.add(cyl(0.02, 0.02, 0.025, metal('#C9C5BE'), x, 0.78, 0.31, 10)))
  return g
}
function tableRoundDining() {
  const g = group()
  g.add(cyl(0.5, 0.5, 0.04, wood(OAK), 0, 0.73, 0, 40))
  g.add(cyl(0.07, 0.09, 0.7, wood('#B58E66'), 0, 0.36, 0, 14))
  g.add(cyl(0.3, 0.32, 0.04, wood('#B58E66'), 0, 0.02, 0, 28))
  return g
}
function microwave() {
  const g = group()
  g.add(box(0.5, 0.3, 0.38, mat('#E9E4DA', { rough: 0.4 }), 0, 0.15, 0))
  g.add(box(0.32, 0.22, 0.01, mat('#222', { rough: 0.2 }), -0.06, 0.15, 0.195))
  g.add(box(0.08, 0.22, 0.01, mat('#B9B4A8'), 0.18, 0.15, 0.195))
  return g
}
function kettle() {
  const g = group()
  g.add(cyl(0.07, 0.1, 0.17, metal('#C9C5BE'), 0, 0.09, 0, 20))
  g.add(cyl(0.05, 0.07, 0.04, mat(charcoal), 0, 0.2, 0, 20))
  g.add(box(0.015, 0.14, 0.04, mat(charcoal), 0.1, 0.17, 0))
  const spout = cyl(0.01, 0.018, 0.1, metal('#C9C5BE'), -0.1, 0.16, 0, 8)
  spout.rotation.z = 0.7
  g.add(spout)
  g.add(box(0.2, 0.01, 0.2, mat(charcoal), 0, 0.005, 0))
  return g
}
function decorJars() {
  const g = group()
  ;[[-0.12, 0.2, 0.05], [0.0, 0.16, 0.055], [0.12, 0.13, 0.045]].forEach(([x, h, r], i) => {
    g.add(cyl(r, r, h, mat('#E4EBEA', { rough: 0.05, opacity: 0.45 }), x, h / 2, 0, 16))
    g.add(cyl(r * 0.95, r * 0.95, h * 0.7, mat(['#C9A27A', '#E3D6C2', '#B58E66'][i], { rough: 0.9 }), x, h * 0.37, 0, 14))
    g.add(cyl(r * 1.02, r * 1.02, 0.025, wood(walnut), x, h + 0.012, 0, 16))
  })
  return g
}

/* ----------------------------- DRESSING EXTRAS ----------------------------- */

function hatStand() {
  const g = group()
  g.add(cyl(0.18, 0.2, 0.03, wood(walnut), 0, 0.015, 0, 24))
  g.add(cyl(0.02, 0.025, 1.55, wood(walnut), 0, 0.8, 0, 10))
  ;[0, 1, 2, 3].forEach((i) => {
    const a = (i / 4) * Math.PI * 2 + 0.3
    const hook = cyl(0.01, 0.01, 0.16, wood(walnut), Math.sin(a) * 0.07, 1.45 - (i % 2) * 0.18, Math.cos(a) * 0.07, 6)
    hook.rotation.set(Math.cos(a) * 1.0, 0, -Math.sin(a) * 1.0)
    g.add(hook)
  })
  g.add(cyl(0.11, 0.11, 0.02, fabric(burgundy), 0.12, 1.34, 0.05, 20))
  g.add(cyl(0.06, 0.07, 0.09, fabric(burgundy), 0.12, 1.4, 0.05, 20))
  g.add(box(0.28, 0.4, 0.04, fabric(sage), -0.1, 1.05, 0.1))
  return g
}
function mirrorStand() {
  const g = group()
  const tilt = group()
  tilt.add(rbox(0.6, 1.65, 0.045, 0.2, wood(walnut), 0, 0.95, 0))
  const glass = rbox(0.52, 1.57, 0.05, 0.17, mat('#DCE5E8', { rough: 0.05, metal: 0.55 }), 0, 0.95, 0.002)
  glass.castShadow = false
  tilt.add(glass)
  tilt.rotation.x = -0.1
  tilt.position.set(0, 0.1, -0.05)
  g.add(tilt)
  ;[-0.22, 0.22].forEach((x) => {
    const leg = box(0.04, 0.04, 0.5, wood(walnut), x, 0.03, 0.0)
    g.add(leg)
  })
  return g
}
function jewelryStand() {
  const g = group()
  g.add(cyl(0.09, 0.1, 0.015, metal('#B89A6A'), 0, 0.008, 0, 20))
  g.add(cyl(0.008, 0.008, 0.28, metal('#B89A6A'), 0, 0.15, 0, 8))
  ;[0.14, 0.2, 0.26].forEach((y, i) => {
    const arm = box(0.2 - i * 0.04, 0.008, 0.008, metal('#B89A6A'), 0, y, 0)
    arm.rotation.y = i * 1.0
    g.add(arm)
  })
  const nk = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.004, 6, 20), metal('#D4B97A'))
  nk.position.set(0.06, 0.15, 0)
  nk.rotation.y = 1.2
  g.add(nk)
  return g
}
function makeupOrganizer() {
  const g = group()
  g.add(box(0.2, 0.14, 0.14, mat('#EDE4D8', { rough: 0.1, opacity: 0.7 }), -0.01, 0.07, 0))
  ;[-0.055, 0.0, 0.055].forEach((x) => g.add(box(0.05, 0.02, 0.12, mat(rose), x - 0.01, 0.15, 0)))
  ;[[0.1, 0.16, burgundy], [0.12, 0.14, sage]].forEach(([x, h, c]) => g.add(cyl(0.018, 0.018, h, mat(c, { rough: 0.4 }), x, h / 2, 0.01, 12)))
  return g
}
function ringLight() {
  const g = group()
  ;[0, 1, 2].forEach((i) => {
    const a = (i / 3) * Math.PI * 2
    const leg = cyl(0.006, 0.008, 0.3, metal(charcoal), Math.sin(a) * 0.07, 0.15, Math.cos(a) * 0.07, 6)
    leg.rotation.z = -Math.sin(a) * 0.4
    leg.rotation.x = Math.cos(a) * 0.4
    g.add(leg)
  })
  g.add(cyl(0.008, 0.008, 0.22, metal(charcoal), 0, 0.4, 0, 6))
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.016, 8, 32), glowShade('#FFF4E0'))
  ring.position.set(0, 0.5, 0)
  markShade(ring, g)
  g.add(ring)
  return g
}

/* ------------------------------ BALCONY EXTRAS ------------------------------ */

function chairEgg() {
  const g = group()
  g.add(cyl(0.03, 0.03, 1.85, metal(charcoal), 0, 0.93, -0.38, 10))
  const arm = cyl(0.025, 0.025, 0.5, metal(charcoal), 0, 1.85, -0.18, 8)
  arm.rotation.x = Math.PI / 2.4
  g.add(arm)
  g.add(cyl(0.2, 0.22, 0.03, metal(charcoal), 0, 0.015, -0.38, 24))
  const mt = new THREE.MeshStandardMaterial({ color: RATTAN, roughness: 0.95, side: THREE.DoubleSide })
  const shell = ownMat(new THREE.Mesh(new THREE.SphereGeometry(0.46, 28, 18, Math.PI * 0.8, Math.PI * 1.4, 0.15, Math.PI * 0.85), mt))
  shell.scale.set(1, 1.1, 0.9)
  shell.position.set(0, 1.0, 0.0)
  shell.castShadow = true
  g.add(shell)
  g.add(sphere(0.32, fabric(cream), 0, 0.88, 0.06, 1, 0.5, 0.9))
  g.add(rbox(0.36, 0.26, 0.1, 0.05, fabric(sage), 0, 1.0, -0.2))
  g.add(cyl(0.006, 0.006, 0.55, metal(charcoal), 0.18, 1.55, -0.12, 6))
  g.add(cyl(0.006, 0.006, 0.55, metal(charcoal), -0.18, 1.55, -0.12, 6))
  return g
}
function umbrellaTable() {
  const g = group()
  g.add(cyl(0.36, 0.36, 0.03, wood('#B58E66'), 0, 0.72, 0, 36))
  g.add(cyl(0.025, 0.025, 2.2, metal(charcoal), 0, 1.1, 0, 10))
  g.add(cyl(0.25, 0.28, 0.025, metal(charcoal), 0, 0.012, 0, 24))
  const canopy = new THREE.Mesh(new THREE.ConeGeometry(0.85, 0.3, 16, 1, true), (() => { const m = fabric(cream).clone(); m.side = THREE.DoubleSide; return m })())
  ownMat(canopy)
  canopy.position.y = 2.2
  canopy.castShadow = true
  g.add(canopy)
  return g
}
function deckChair() {
  const g = group()
  const w = wood('#B58E66')
  ;[-0.27, 0.27].forEach((x) => {
    const seat = box(0.04, 0.04, 0.95, w, x, 0.27, 0.05)
    seat.rotation.x = 0.35
    g.add(seat)
    const back = box(0.04, 0.04, 0.7, w, x, 0.58, -0.35)
    back.rotation.x = -0.9
    g.add(back)
    const leg = box(0.04, 0.55, 0.04, w, x, 0.26, 0.4)
    leg.rotation.x = 0.35
    g.add(leg)
  })
  const sling = box(0.5, 0.02, 1.1, fabric(cream), 0, 0.34, 0.0)
  sling.rotation.x = 0.28
  g.add(sling)
  g.add(box(0.5, 0.02, 0.7, fabric(sage), 0, 0.6, -0.34)).children
  g.children[g.children.length - 1].rotation.x = -0.9
  return g
}
function grill() {
  const g = group()
  g.add(box(0.7, 0.28, 0.45, mat(charcoal, { rough: 0.5 }), 0, 0.72, 0))
  const lid = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(charcoal, { rough: 0.4 }))
  lid.scale.set(1.45, 0.9, 0.95)
  lid.position.y = 0.86
  lid.castShadow = true
  g.add(lid)
  g.add(box(0.5, 0.025, 0.03, metal(), 0, 1.0, 0.24))
  ;[[-0.32, -0.18], [0.32, -0.18], [-0.32, 0.18], [0.32, 0.18]].forEach(([x, z], i) => {
    g.add(cyl(0.015, 0.015, 0.58, metal(charcoal), x, 0.29, z, 8))
    if (i > 1) g.add(cyl(0.04, 0.04, 0.03, mat('#111'), x, 0.02, z, 12))
  })
  g.add(box(0.66, 0.02, 0.4, metal(charcoal), 0, 0.3, 0))
  return g
}
function plantStand() {
  const g = group()
  g.add(cyl(0.2, 0.2, 0.03, wood('#B58E66'), 0, 0.52, 0, 28))
  ;[0, 1, 2].forEach((i) => {
    const a = (i / 3) * Math.PI * 2
    const leg = cyl(0.015, 0.02, 0.52, wood(walnut), Math.sin(a) * 0.14, 0.26, Math.cos(a) * 0.14, 8)
    leg.rotation.z = -Math.sin(a) * 0.12
    leg.rotation.x = Math.cos(a) * 0.12
    g.add(leg)
  })
  g.add(cyl(0.14, 0.14, 0.02, wood(walnut), 0, 0.2, 0, 24))
  return g
}
function firePit() {
  const g = group()
  g.add(cyl(0.4, 0.42, 0.28, mat('#8A8279', { rough: 1 }), 0, 0.14, 0, 28))
  g.add(cyl(0.34, 0.34, 0.03, mat('#2A2523', { rough: 1 }), 0, 0.28, 0, 28))
  ;[[0, 0, 0.3], [0.1, 0.06, 0.22], [-0.1, -0.04, 0.2]].forEach(([x, z, h], i) => {
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.09, h, 8), glowShade(i ? '#FF8A3D' : '#FFB347'))
    flame.material.color.set(i ? '#FF8A3D' : '#FFB347')
    flame.material.emissive.set('#FF8A3D')
    flame.material.emissiveIntensity = 0.6
    flame.position.set(x, 0.3 + h / 2, z)
    markShade(flame, g)
    g.add(flame)
  })
  ;[0, 1, 2, 3, 4].forEach((i) => g.add(sphere(0.06, mat('#3A302B', { rough: 1 }), Math.sin(i * 1.26) * 0.15, 0.3, Math.cos(i * 1.26) * 0.15, 1, 0.7, 1)))
  return g
}
function barCart() {
  const g = group()
  const gold = metal('#B89A6A')
  ;[[-0.36, -0.17], [0.36, -0.17], [-0.36, 0.17], [0.36, 0.17]].forEach(([x, z]) => g.add(cyl(0.012, 0.012, 0.86, gold, x, 0.46, z, 8)))
  ;[0.25, 0.85].forEach((y) => {
    g.add(box(0.8, 0.02, 0.42, mat('#EDE4D8', { rough: 0.1, opacity: 0.8 }), 0, y, 0))
    g.add(box(0.82, 0.03, 0.02, gold, 0, y + 0.02, 0.21))
    g.add(box(0.82, 0.03, 0.02, gold, 0, y + 0.02, -0.21))
  })
  g.add(box(0.03, 0.03, 0.46, gold, -0.4, 0.86, 0))
  g.add(box(0.03, 0.03, 0.46, gold, 0.4, 0.86, 0))
  ;[[-0.36, -0.17], [0.36, -0.17], [-0.36, 0.17], [0.36, 0.17]].forEach(([x, z]) => g.add(cyl(0.04, 0.04, 0.025, mat(charcoal), x, 0.02, z, 14)))
  ;[[-0.25, 0.3, '#7B8FA0'], [-0.1, 0.24, burgundy], [0.05, 0.28, '#7F9172']].forEach(([x, h, c]) => {
    g.add(cyl(0.035, 0.04, h * 0.6, mat(c, { rough: 0.1, opacity: 0.85 }), x, 0.26 + h * 0.3, 0, 14))
    g.add(cyl(0.015, 0.02, h * 0.4, mat(c, { rough: 0.1, opacity: 0.85 }), x, 0.26 + h * 0.8, 0, 12))
  })
  g.add(cyl(0.05, 0.035, 0.07, mat(cream, { rough: 0.2 }), 0.25, 0.9, 0, 14))
  return g
}

export const MORE_MODELS = {
  'bed-canopy': bedCanopy, 'bed-single': bedSingle, 'bed-daybed': bedDaybed,
  'table-tripod': tableTripod, 'table-cube': tableCube, 'table-drum': tableDrum,
  'chair-barrel': chairBarrel, 'bench-end': benchEnd, 'chair-bean': chairBean, 'chair-rocking': chairRocking,
  'chair-wing': chairWing, 'sofa-chesterfield': sofaChesterfield, ottoman,
  'rug-runner': rugRunner, 'rug-checker': rugChecker, 'rug-small-round': rugSmallRound,
  'lamp-tripod': lampTripod, 'lamp-globe': lampGlobe, 'lamp-mushroom': lampMushroom, 'lamp-pleated': lampPleated,
  'plant-monstera': plantMonstera, 'plant-palm': plantPalm, 'plant-olive': plantOlive, 'plant-succulents': plantSucculents,
  'wall-shelf': wallShelf, 'wall-clock': wallClock, 'wall-sunburst': wallSunburst, pinboard, 'range-hood': rangeHood,
  'chest-tall': chestTall, trunk, 'cube-shelf': cubeShelf, 'shoe-rack': shoeRack,
  'decor-candles': decorCandles, 'decor-basket': decorBasket, 'decor-globe': decorGlobe, 'decor-frames': decorFrames,
  'decor-tray': decorTray, 'blanket-ladder': blanketLadder,
  'tv-unit': tvUnit, fireplace, 'shelf-wide': shelfWide, easel, 'desk-organizer': deskOrganizer,
  fridge, 'stove-counter': stoveCounter, 'table-round-dining': tableRoundDining, microwave, kettle, 'decor-jars': decorJars,
  'hat-stand': hatStand, 'mirror-stand': mirrorStand, 'jewelry-stand': jewelryStand, 'makeup-organizer': makeupOrganizer, 'ring-light': ringLight,
  'chair-egg': chairEgg, 'umbrella-table': umbrellaTable, 'deck-chair': deckChair, grill, 'plant-stand': plantStand,
  'fire-pit': firePit, 'bar-cart': barCart,
}
