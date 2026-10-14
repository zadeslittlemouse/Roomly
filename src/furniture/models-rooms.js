// Procedural models for the Living Room, Study, Kitchen, Dressing Room and Balcony.
// Same rules as models.js: origin = centre of footprint on the floor, front faces +Z.
// Wall-mounted items (cabinets, mirrors) are centred on their own origin and have
// their depth listed as `wallDepth` in the catalog.
import * as THREE from 'three'
import { BRAND } from '../data/palette.js'
import { mat, box, rbox, cyl, sphere, group } from '../utils/three-helpers.js'
import { wood, fabric, metal, glowShade, markShade, pot } from './models.js'

const { ivory, cream, rose, sage, burgundy, walnut, charcoal } = BRAND
const OAK = '#C9A27A'
const PAINT = '#F2ECE2'
const RATTAN = '#C8A878'
const LEAF = '#7F9172'
const LEAF_DARK = '#5F7655'
const BOOK_COLORS = [burgundy, sage, cream, rose, '#C9B9A2', charcoal, '#7B8FA0']

/* ============================ LIVING ROOM ============================ */

export function sofaBase({ w, d = 0.95, color, cushion, cushions }) {
  const g = group()
  const armW = 0.18
  g.add(rbox(w, 0.28, d, 0.06, fabric(color), 0, 0.3, 0))
  g.add(rbox(w, 0.52, 0.2, 0.08, fabric(color), 0, 0.68, -d / 2 + 0.12))
  ;[-1, 1].forEach((s) => g.add(rbox(armW, 0.44, d, 0.07, fabric(color), s * (w / 2 - armW / 2), 0.5, 0)))
  const cw = (w - armW * 2) / cushions
  for (let i = 0; i < cushions; i++) {
    g.add(rbox(cw - 0.02, 0.16, d - 0.3, 0.05, fabric(cushion), -((w - armW * 2) / 2) + cw * (i + 0.5), 0.52, 0.08))
    g.add(rbox(cw - 0.06, 0.4, 0.14, 0.06, fabric(cushion), -((w - armW * 2) / 2) + cw * (i + 0.5), 0.78, -d / 2 + 0.3))
  }
  ;[[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) =>
    g.add(cyl(0.03, 0.02, 0.14, wood(walnut), sx * (w / 2 - 0.1), 0.07, sz * (d / 2 - 0.1), 10)),
  )
  const pillow = rbox(0.4, 0.34, 0.12, 0.06, fabric(rose), -w / 2 + 0.42, 0.7, 0.05)
  pillow.rotation.z = 0.15
  g.add(pillow)
  return g
}
const sofaClassic = () => sofaBase({ w: 2.1, color: '#8FA085', cushion: '#A5B497', cushions: 3 })
const sofaLoveseat = () => sofaBase({ w: 1.5, color: '#E3D6C2', cushion: '#EFE5D4', cushions: 2 })

function coffeeRound() {
  const g = group()
  g.add(cyl(0.45, 0.45, 0.04, wood(walnut), 0, 0.4, 0, 40))
  g.add(cyl(0.3, 0.3, 0.03, wood('#7A5A42'), 0, 0.16, 0, 40))
  ;[0, 1, 2, 3].forEach((i) => {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4
    g.add(cyl(0.02, 0.02, 0.4, metal('#9A8466'), Math.sin(a) * 0.3, 0.2, Math.cos(a) * 0.3, 8))
  })
  return g
}
function coffeeRect() {
  const g = group()
  g.add(box(1.1, 0.04, 0.6, wood(OAK), 0, 0.38, 0))
  g.add(box(1.0, 0.03, 0.5, wood('#B58E66'), 0, 0.14, 0))
  ;[[-0.5, -0.25], [0.5, -0.25], [-0.5, 0.25], [0.5, 0.25]].forEach(([x, z]) =>
    g.add(box(0.05, 0.36, 0.05, wood('#B58E66'), x, 0.18, z)),
  )
  return g
}
function booksRow(g, w, y, z, seed) {
  let x = -w / 2 + 0.05
  let i = seed
  while (x < w / 2 - 0.1) {
    const bw = 0.03 + ((i * 7) % 4) * 0.012
    const bh = 0.2 + ((i * 5) % 4) * 0.035
    g.add(box(bw, bh, 0.22, fabric(BOOK_COLORS[i % BOOK_COLORS.length]), x + bw / 2, y + bh / 2, z))
    x += bw + 0.006
    i += 1
    if (i % 6 === 0) x += 0.16 // a gap now and then
  }
}
function shelfTall() {
  const g = group()
  const w = wood(walnut)
  g.add(box(0.04, 1.9, 0.35, w, -0.43, 0.95, 0))
  g.add(box(0.04, 1.9, 0.35, w, 0.43, 0.95, 0))
  g.add(box(0.86, 1.9, 0.02, wood('#7A5A42'), 0, 0.95, -0.165))
  ;[0.04, 0.4, 0.76, 1.12, 1.48, 1.88].forEach((y, i) => {
    g.add(box(0.86, 0.04, 0.35, w, 0, y, 0))
    if (i > 0 && i < 5 && i !== 3) booksRow(g, 0.82, y + 0.02, 0.0, i * 3)
  })
  g.add(rbox(0.2, 0.2, 0.2, 0.04, mat(rose, { rough: 0.6 }), 0.2, 1.24, 0))
  return g
}
function consoleLow() {
  const g = group()
  g.add(box(1.4, 0.42, 0.4, wood(OAK), 0, 0.33, 0))
  g.add(box(1.46, 0.04, 0.44, wood('#B58E66'), 0, 0.55, 0))
  ;[-0.45, 0, 0.45].forEach((x) => {
    g.add(box(0.42, 0.34, 0.015, wood('#D6B48C'), x, 0.33, 0.205))
    g.add(sphere(0.018, metal(), x + 0.14, 0.33, 0.22))
  })
  ;[[-0.62, -0.15], [0.62, -0.15], [-0.62, 0.15], [0.62, 0.15]].forEach(([x, z]) =>
    g.add(cyl(0.025, 0.018, 0.14, wood(walnut), x, 0.07, z, 8)),
  )
  return g
}
function lampArc() {
  const g = group()
  g.add(cyl(0.2, 0.22, 0.05, mat('#EDEAE4', { rough: 0.3 }), 0, 0.025, 0, 24))
  g.add(cyl(0.012, 0.012, 1.55, metal(charcoal), -0.1, 0.8, 0))
  const boom = cyl(0.012, 0.012, 0.62, metal(charcoal), 0.1, 1.62, 0, 8)
  boom.rotation.z = Math.PI / 2 - 0.25
  g.add(boom)
  const shade = cyl(0.1, 0.2, 0.2, glowShade(ivory), 0.32, 1.52, 0, 24)
  markShade(shade, g)
  g.add(shade)
  return g
}

/* ================================ STUDY ================================ */

function deskBase({ top, legs, w, d, drawers }) {
  const g = group()
  g.add(box(w, 0.04, d, wood(top), 0, 0.73, 0))
  ;[[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
    if (drawers && sx === 1) return
    g.add(box(0.05, 0.71, 0.05, wood(legs), sx * (w / 2 - 0.05), 0.355, sz * (d / 2 - 0.05)))
  })
  if (drawers) {
    g.add(box(0.42, 0.7, d - 0.06, wood(legs), w / 2 - 0.23, 0.36, 0))
    ;[0.55, 0.38, 0.21].forEach((y) => {
      g.add(box(0.36, 0.14, 0.015, wood(top), w / 2 - 0.23, y, d / 2 - 0.02))
      g.add(sphere(0.015, metal(), w / 2 - 0.23, y, d / 2))
    })
  }
  g.add(box(w - 0.1, 0.1, 0.03, wood(legs), 0, 0.64, -d / 2 + 0.05))
  return g
}
const deskWood = () => deskBase({ top: walnut, legs: '#6B4D38', w: 1.4, d: 0.7, drawers: true })
const deskWhite = () => deskBase({ top: PAINT, legs: OAK, w: 1.2, d: 0.6, drawers: false })

function chairDesk() {
  const g = group()
  g.add(cyl(0.025, 0.025, 0.3, metal(charcoal), 0, 0.22, 0, 10))
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2
    const arm = box(0.3, 0.025, 0.04, metal(charcoal), Math.sin(a) * 0.15, 0.07, Math.cos(a) * 0.15)
    arm.rotation.y = a + Math.PI / 2
    g.add(arm)
    g.add(sphere(0.03, mat(charcoal, { rough: 0.5 }), Math.sin(a) * 0.29, 0.04, Math.cos(a) * 0.29))
  }
  g.add(rbox(0.5, 0.1, 0.48, 0.05, fabric(burgundy), 0, 0.46, 0))
  g.add(rbox(0.46, 0.5, 0.08, 0.06, fabric(burgundy), 0, 0.78, -0.22))
  return g
}
function monitor() {
  const g = group()
  g.add(box(0.2, 0.015, 0.16, metal(charcoal), 0, 0.008, 0))
  g.add(box(0.05, 0.16, 0.03, metal(charcoal), 0, 0.09, -0.02))
  g.add(box(0.6, 0.35, 0.025, mat('#2A2826', { rough: 0.4 }), 0, 0.29, -0.03))
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.31), new THREE.MeshBasicMaterial({ color: '#CFE0EA' }))
  screen.position.set(0, 0.29, -0.0165)
  g.add(screen)
  const bar = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.025), new THREE.MeshBasicMaterial({ color: rose }))
  bar.position.set(-0.12, 0.38, -0.0155)
  g.add(bar)
  return g
}
function laptop() {
  const g = group()
  g.add(box(0.34, 0.015, 0.23, metal('#C9C5BE'), 0, 0.008, 0.01))
  const lid = group()
  lid.add(box(0.34, 0.22, 0.01, metal('#C9C5BE'), 0, 0.11, 0))
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.31, 0.19), new THREE.MeshBasicMaterial({ color: '#F1E6D6' }))
  scr.position.set(0, 0.11, 0.0055)
  lid.add(scr)
  lid.position.set(0, 0.012, -0.1)
  lid.rotation.x = -0.28
  g.add(lid)
  return g
}
function lampDesk() {
  const g = group()
  g.add(cyl(0.07, 0.08, 0.02, metal(charcoal), 0, 0.01, 0, 20))
  const arm1 = cyl(0.008, 0.008, 0.3, metal(charcoal), 0, 0.16, 0, 8)
  g.add(arm1)
  const arm2 = cyl(0.008, 0.008, 0.22, metal(charcoal), 0.08, 0.3, 0, 8)
  arm2.rotation.z = -1.0
  g.add(arm2)
  const shade = cyl(0.03, 0.08, 0.09, glowShade('#E9C7C0'), 0.17, 0.33, 0, 20)
  shade.rotation.z = -0.2
  markShade(shade, g)
  g.add(shade)
  return g
}
function cabinetDrawers() {
  const g = group()
  g.add(box(0.5, 0.56, 0.5, wood(OAK), 0, 0.31, 0))
  g.add(box(0.54, 0.03, 0.54, wood('#B58E66'), 0, 0.595, 0))
  ;[0.14, 0.31, 0.48].forEach((y) => {
    g.add(box(0.44, 0.14, 0.015, wood('#D6B48C'), 0, y + 0.03, 0.255))
    g.add(sphere(0.014, metal(), 0, y + 0.03, 0.27))
  })
  ;[[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].forEach(([x, z]) => g.add(box(0.04, 0.03, 0.04, wood(walnut), x, 0.015, z)))
  return g
}

/* =============================== KITCHEN =============================== */

function counterBase({ body, top, sink }) {
  const g = group()
  g.add(box(1.2, 0.08, 0.58, wood('#4A3F38'), 0, 0.04, 0))
  g.add(box(1.2, 0.78, 0.58, mat(body, { rough: 0.55 }), 0, 0.47, 0))
  g.add(box(1.24, 0.04, 0.64, mat(top, { rough: 0.35 }), 0, 0.88, 0))
  ;[-0.3, 0.3].forEach((x) => {
    g.add(box(0.56, 0.7, 0.015, mat(body, { rough: 0.55 }), x, 0.47, 0.295))
    g.add(box(0.1, 0.014, 0.02, metal(), x + (x < 0 ? 0.2 : -0.2), 0.76, 0.31))
  })
  if (sink) {
    g.add(box(0.5, 0.012, 0.36, mat('#B9BCBD', { rough: 0.25, metal: 0.7 }), -0.1, 0.903, 0.02))
    g.add(cyl(0.012, 0.012, 0.22, metal('#C9C5BE'), 0.18, 1.0, -0.2, 10))
    const spout = cyl(0.01, 0.01, 0.14, metal('#C9C5BE'), 0.18, 1.1, -0.13, 10)
    spout.rotation.x = Math.PI / 2
    g.add(spout)
  }
  return g
}
const counterSage = () => counterBase({ body: '#9BAA8B', top: '#EDE4D8' })
const counterOak = () => counterBase({ body: '#C9A27A', top: '#E6DCCB' })
const sinkCounter = () => counterBase({ body: '#9BAA8B', top: '#EDE4D8', sink: true })

function island() {
  const g = group()
  g.add(box(1.5, 0.84, 0.7, mat(sage, { rough: 0.55 }), -0.0, 0.46, -0.08))
  g.add(box(1.6, 0.05, 0.9, wood(OAK), 0, 0.9, 0))
  g.add(box(1.5, 0.08, 0.7, wood('#4A3F38'), 0, 0.04, -0.08))
  ;[-0.5, 0, 0.5].forEach((x) => {
    g.add(box(0.44, 0.6, 0.015, mat('#AEBB9F', { rough: 0.55 }), x, 0.5, 0.275))
    g.add(box(0.1, 0.014, 0.02, metal(), x, 0.76, 0.29))
  })
  return g
}
function cabinetUpper(glass) {
  const g = group()
  const body = mat(PAINT, { rough: 0.5 })
  g.add(box(1.0, 0.7, 0.35, body, 0, 0, 0))
  ;[-0.25, 0.25].forEach((x) => {
    if (glass) {
      g.add(box(0.46, 0.62, 0.018, wood(walnut), x, 0, 0.185))
      g.add(box(0.38, 0.54, 0.02, mat('#DDEBF2', { rough: 0.1, opacity: 0.5 }), x, 0, 0.19))
      g.add(box(0.36, 0.04, 0.22, mat(cream, { rough: 0.8 }), x, -0.1, 0.05))
      g.add(rbox(0.14, 0.12, 0.14, 0.03, mat(rose, { rough: 0.6 }), x, 0.0, 0.05))
    } else {
      g.add(box(0.46, 0.62, 0.018, mat('#E8E1D3', { rough: 0.5 }), x, 0, 0.185))
    }
    g.add(box(0.014, 0.12, 0.02, metal(), x + (x < 0 ? 0.18 : -0.18), -0.2, 0.2))
  })
  return g
}
function pantry() {
  const g = group()
  g.add(box(0.8, 2.1, 0.6, mat(sage, { rough: 0.55 }), 0, 1.05, 0))
  ;[-0.2, 0.2].forEach((x) => g.add(box(0.38, 1.0, 0.015, mat('#AEBB9F', { rough: 0.55 }), x, 0.6, 0.305)))
  ;[-0.2, 0.2].forEach((x) => g.add(box(0.38, 0.85, 0.015, mat('#AEBB9F', { rough: 0.55 }), x, 1.6, 0.305)))
  ;[-0.04, 0.04].forEach((x) => g.add(box(0.014, 0.22, 0.02, metal(), x, 1.05, 0.32)))
  g.add(box(0.84, 0.04, 0.64, wood(OAK), 0, 2.12, 0))
  return g
}
function stoolBar() {
  const g = group()
  g.add(rbox(0.36, 0.06, 0.36, 0.03, fabric(burgundy), 0, 0.69, 0))
  g.add(cyl(0.18, 0.18, 0.015, wood(OAK), 0, 0.655, 0, 24))
  ;[0, 1, 2, 3].forEach((i) => {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4
    const leg = cyl(0.015, 0.02, 0.66, wood(OAK), Math.sin(a) * 0.14, 0.33, Math.cos(a) * 0.14, 8)
    leg.rotation.z = Math.sin(a) * -0.07
    leg.rotation.x = Math.cos(a) * 0.07
    g.add(leg)
  })
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.008, 6, 24), metal())
  ring.rotation.x = Math.PI / 2
  ring.position.y = 0.25
  g.add(ring)
  return g
}
function tableDining() {
  const g = group()
  g.add(box(1.4, 0.04, 0.85, wood(OAK), 0, 0.74, 0))
  ;[[-0.62, -0.36], [0.62, -0.36], [-0.62, 0.36], [0.62, 0.36]].forEach(([x, z]) =>
    g.add(cyl(0.03, 0.022, 0.72, wood('#B58E66'), x, 0.36, z, 10)),
  )
  g.add(box(1.2, 0.05, 0.06, wood('#B58E66'), 0, 0.68, 0))
  return g
}
function decorFruit() {
  const g = group()
  g.add(cyl(0.14, 0.08, 0.07, mat(cream, { rough: 0.3 }), 0, 0.035, 0, 24))
  ;[['#C55A4A', -0.05, 0.1, 0], ['#E3B04B', 0.05, 0.1, 0.03], ['#8FA085', 0, 0.12, -0.05], ['#D98A5B', 0.02, 0.09, 0.07]].forEach(([c, x, y, z]) =>
    g.add(sphere(0.045, mat(c, { rough: 0.5 }), x, y, z)),
  )
  return g
}

/* ============================= DRESSING ROOM ============================= */

function vanityBase({ top, body }) {
  const g = group()
  g.add(box(1.1, 0.04, 0.5, wood(top), 0, 0.76, 0))
  ;[[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) =>
    g.add(cyl(0.025, 0.018, 0.74, wood(body), sx * 0.5, 0.37, sz * 0.2, 10)),
  )
  ;[-0.3, 0.3].forEach((x) => {
    g.add(box(0.44, 0.14, 0.4, wood(body), x, 0.66, 0))
    g.add(box(0.4, 0.1, 0.015, wood(top), x, 0.66, 0.205))
    g.add(sphere(0.016, metal(), x, 0.66, 0.22))
  })
  return g
}
const vanityWood = () => vanityBase({ top: '#9A7658', body: walnut })
const vanityWhite = () => vanityBase({ top: PAINT, body: '#D8CBB8' })

function mirrorRound() {
  const g = group()
  const frame = cyl(0.4, 0.4, 0.045, wood(walnut), 0, 0, 0, 40)
  frame.rotation.x = Math.PI / 2
  g.add(frame)
  const glass = cyl(0.35, 0.35, 0.05, mat('#DCE5E8', { rough: 0.05, metal: 0.55 }), 0, 0, 0.002, 40)
  glass.rotation.x = Math.PI / 2
  glass.castShadow = false
  g.add(glass)
  return g
}
function mirrorArch() {
  const g = group()
  g.add(rbox(0.6, 1.2, 0.045, 0.28, wood('#B89A6A'), 0, 0, 0))
  const glass = rbox(0.52, 1.12, 0.05, 0.24, mat('#DCE5E8', { rough: 0.05, metal: 0.55 }), 0, 0, 0.002)
  glass.castShadow = false
  g.add(glass)
  return g
}
function stoolVanity() {
  const g = group()
  g.add(cyl(0.2, 0.2, 0.08, fabric(rose), 0, 0.44, 0, 28))
  ;[0, 1, 2, 3].forEach((i) => {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4
    g.add(cyl(0.012, 0.012, 0.42, metal(), Math.sin(a) * 0.14, 0.21, Math.cos(a) * 0.14, 8))
  })
  return g
}
function dresser() {
  const g = group()
  g.add(box(1.0, 0.76, 0.5, wood(walnut), 0, 0.42, 0))
  g.add(box(1.06, 0.04, 0.54, wood('#7A5A42'), 0, 0.82, 0))
  ;[0.2, 0.45, 0.7].forEach((y) => {
    g.add(box(0.9, 0.2, 0.015, wood('#9A7658'), 0, y - 0.04, 0.255))
    g.add(sphere(0.016, metal(), -0.12, y - 0.04, 0.27))
    g.add(sphere(0.016, metal(), 0.12, y - 0.04, 0.27))
  })
  ;[[-0.45, -0.2], [0.45, -0.2], [-0.45, 0.2], [0.45, 0.2]].forEach(([x, z]) => g.add(cyl(0.025, 0.018, 0.06, wood('#6B4D38'), x, 0.03, z, 8)))
  return g
}
function decorPerfume() {
  const g = group()
  g.add(rbox(0.07, 0.11, 0.05, 0.015, mat('#E8C9C4', { rough: 0.1, opacity: 0.85 }), -0.02, 0.055, 0))
  g.add(cyl(0.012, 0.012, 0.035, metal(), -0.02, 0.13, 0, 10))
  g.add(cyl(0.025, 0.025, 0.12, mat(cream, { rough: 0.2 }), 0.04, 0.06, 0.02, 14))
  return g
}
function decorJewelry() {
  const g = group()
  g.add(rbox(0.2, 0.06, 0.14, 0.02, wood(walnut), 0, 0.03, 0))
  const lid = rbox(0.2, 0.025, 0.14, 0.01, wood('#9A7658'), 0, 0.075, -0.02)
  lid.rotation.x = -0.25
  g.add(lid)
  g.add(sphere(0.012, metal(), 0, 0.08, 0.04))
  return g
}

/* ================================ BALCONY ================================ */

function rattanChair() {
  const g = group()
  const r = mat(RATTAN, { rough: 0.9 })
  g.add(rbox(0.7, 0.18, 0.68, 0.08, r, 0, 0.3, 0.02))
  g.add(rbox(0.7, 0.55, 0.14, 0.1, r, 0, 0.62, -0.3))
  ;[-1, 1].forEach((s) => g.add(rbox(0.1, 0.22, 0.6, 0.04, r, s * 0.32, 0.5, 0.04)))
  g.add(rbox(0.54, 0.12, 0.5, 0.06, fabric(cream), 0, 0.44, 0.08))
  const cushion = rbox(0.4, 0.3, 0.1, 0.05, fabric(sage), 0, 0.68, -0.18)
  cushion.rotation.x = -0.2
  g.add(cushion)
  ;[[-0.3, -0.28], [0.3, -0.28], [-0.3, 0.3], [0.3, 0.3]].forEach(([x, z]) => g.add(cyl(0.025, 0.02, 0.22, wood(walnut), x, 0.11, z, 8)))
  return g
}
function outdoorSofa() {
  const g = group()
  const r = mat(RATTAN, { rough: 0.9 })
  g.add(rbox(1.7, 0.2, 0.8, 0.07, r, 0, 0.3, 0))
  g.add(rbox(1.7, 0.5, 0.14, 0.08, r, 0, 0.62, -0.33))
  ;[-1, 1].forEach((s) => g.add(rbox(0.12, 0.26, 0.74, 0.05, r, s * 0.79, 0.5, 0)))
  ;[-0.38, 0.38].forEach((x) => g.add(rbox(0.74, 0.12, 0.6, 0.05, fabric(cream), x, 0.46, 0.06)))
  ;[-0.38, 0.38].forEach((x, i) => {
    const c = rbox(0.5, 0.3, 0.1, 0.05, fabric(i ? rose : sage), x, 0.7, -0.2)
    c.rotation.x = -0.2
    g.add(c)
  })
  ;[[-0.78, -0.33], [0.78, -0.33], [-0.78, 0.33], [0.78, 0.33]].forEach(([x, z]) => g.add(cyl(0.025, 0.02, 0.2, wood(walnut), x, 0.1, z, 8)))
  return g
}
function benchWood() {
  const g = group()
  const w = wood('#B58E66')
  for (let i = 0; i < 4; i++) g.add(box(1.4, 0.03, 0.1, w, 0, 0.42, -0.17 + i * 0.115))
  ;[0.62, 0.8].forEach((y, i) => g.add(box(1.4, 0.07, 0.025, w, 0, y - (i ? 0 : 0.0), -0.22)))
  ;[-0.64, 0, 0.64].forEach((x) => g.add(box(0.05, 0.4, 0.4, w, x, 0.2, 0)))
  ;[-0.64, 0.64].forEach((x) => g.add(box(0.05, 0.4, 0.04, w, x, 0.62, -0.22)))
  g.add(rbox(1.3, 0.07, 0.42, 0.03, fabric(cream), 0, 0.47, 0.02))
  return g
}
function tableBistro() {
  const g = group()
  g.add(cyl(0.3, 0.3, 0.025, metal(charcoal), 0, 0.69, 0, 36))
  g.add(cyl(0.02, 0.02, 0.66, metal(charcoal), 0, 0.34, 0, 10))
  g.add(cyl(0.2, 0.22, 0.02, metal(charcoal), 0, 0.01, 0, 24))
  return g
}
function planterBox() {
  const g = group()
  g.add(box(1.0, 0.36, 0.28, mat('#B9775A', { rough: 0.85 }), 0, 0.18, 0))
  g.add(box(0.92, 0.03, 0.2, mat('#4A3A2E', { rough: 1 }), 0, 0.37, 0))
  for (let i = 0; i < 8; i++) {
    const x = -0.4 + i * 0.115
    g.add(sphere(0.09 + (i % 3) * 0.015, mat(i % 2 ? LEAF : LEAF_DARK, { rough: 0.7 }), x, 0.46 + (i % 3) * 0.04, (i % 2 ? 0.03 : -0.03), 1, 0.9, 1))
  }
  ;[-0.1, 0.25, 0.4].forEach((x, i) => g.add(sphere(0.03, mat(i ? rose : '#EBD9B8', { rough: 0.8 }), x, 0.6 + i * 0.03, 0.05)))
  return g
}
function planterTall() {
  const g = group()
  g.add(cyl(0.17, 0.12, 0.5, mat(charcoal, { rough: 0.6 }), 0, 0.25, 0, 24))
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2
    const h = 0.55 + (i % 4) * 0.12
    const blade = cyl(0.004, 0.025, h, mat(i % 2 ? LEAF : LEAF_DARK, { rough: 0.7 }), Math.sin(a) * 0.07, 0.5 + h / 2, Math.cos(a) * 0.07, 6)
    blade.rotation.z = Math.sin(a) * 0.25
    blade.rotation.x = Math.cos(a) * 0.25
    g.add(blade)
  }
  return g
}
function rugWoven() {
  const g = group()
  const base = box(2.0, 0.02, 1.4, fabric('#CDB48C'), 0, 0.01, 0)
  base.castShadow = false
  g.add(base)
  for (let i = 0; i < 5; i++) {
    const s = box(2.0, 0.024, 0.04, fabric(i % 2 ? '#B89A6A' : ivory), 0, 0.012, -0.5 + i * 0.25)
    s.castShadow = false
    g.add(s)
  }
  return g
}
function lanternBody(s, g) {
  g.add(box(0.2 * s, 0.02, 0.2 * s, metal(charcoal), 0, 0.01, 0))
  g.add(box(0.2 * s, 0.02, 0.2 * s, metal(charcoal), 0, 0.35 * s, 0))
  const core = box(0.15 * s, 0.3 * s, 0.15 * s, glowShade('#FFE2B0'), 0, 0.18 * s, 0)
  markShade(core, g)
  g.add(core)
  ;[[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => g.add(box(0.012, 0.34 * s, 0.012, metal(charcoal), sx * 0.09 * s, 0.18 * s, sz * 0.09 * s)))
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.06 * s, 0.006, 6, 16, Math.PI), metal(charcoal))
  handle.position.y = 0.36 * s
  g.add(handle)
}
function lanternFloor() {
  const g = group()
  const inner = group()
  lanternBody(1.5, inner)
  g.add(inner)
  g.userData.shades = inner.userData.shades
  return g
}
function lanternTable() {
  const g = group()
  lanternBody(1, g)
  return g
}

export const ROOM_MODELS = {
  'sofa-classic': sofaClassic,
  'sofa-loveseat': sofaLoveseat,
  'coffee-round': coffeeRound,
  'coffee-rect': coffeeRect,
  'shelf-tall': shelfTall,
  'console-low': consoleLow,
  'lamp-arc': lampArc,
  'desk-wood': deskWood,
  'desk-white': deskWhite,
  'chair-desk': chairDesk,
  monitor,
  laptop,
  'lamp-desk': lampDesk,
  'cabinet-drawers': cabinetDrawers,
  'counter-sage': counterSage,
  'counter-oak': counterOak,
  'sink-counter': sinkCounter,
  island,
  'cabinet-upper': () => cabinetUpper(false),
  'cabinet-glass': () => cabinetUpper(true),
  pantry,
  'stool-bar': stoolBar,
  'table-dining': tableDining,
  'decor-fruit': decorFruit,
  'vanity-wood': vanityWood,
  'vanity-white': vanityWhite,
  'mirror-round': mirrorRound,
  'mirror-arch': mirrorArch,
  'stool-vanity': stoolVanity,
  dresser,
  'decor-perfume': decorPerfume,
  'decor-jewelry': decorJewelry,
  'chair-rattan': rattanChair,
  'outdoor-sofa': outdoorSofa,
  'bench-wood': benchWood,
  'table-bistro': tableBistro,
  'planter-box': planterBox,
  'planter-tall': planterTall,
  'rug-woven': rugWoven,
  'lantern-floor': lanternFloor,
  'lantern-table': lanternTable,
}
