// Procedural 3D furniture. Every model is built from simple Three.js shapes.
//
// COORDINATE RULES (same for every item, units are metres):
//   - The model's origin (0,0,0) is the centre of its footprint, ON the floor.
//   - The "front" of the item faces +Z. Its back is at -Z (so a bed's
//     headboard is at -Z and sits against the wall at rotation 0).
//   - Wall art is different: its origin is the centre of the picture and it
//     faces +Z (the placement code turns it to face the room).
import * as THREE from 'three'
import { BRAND } from '../data/palette.js'
import { mat, box, rbox, cyl, sphere, group } from '../utils/three-helpers.js'
import { makeArtCanvas, ART_SIZES } from './art.js'

const { ivory, cream, rose, sage, burgundy, walnut, charcoal } = BRAND
const OAK = '#C9A27A'
const PALE = '#E2CDAA'
const PAINT = '#F2ECE2'
const TERRACOTTA = '#B9775A'
const LEAF = '#7F9172'
const LEAF_DARK = '#5F7655'

const wood = (c) => mat(c, { rough: 0.65 })
const fabric = (c) => mat(c, { rough: 0.95 })
const metal = (c = '#B89A6A') => mat(c, { rough: 0.35, metal: 0.8 })

// A lamp shade that can glow. It gets its own material so the glow can be
// changed per lighting preset without touching other objects.
function glowShade(color) {
  const m = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.9,
    emissive: new THREE.Color('#FFC27A'),
    emissiveIntensity: 0,
  })
  return m
}
function markShade(mesh, g) {
  mesh.userData.ownMaterial = true
  mesh.castShadow = false
  g.userData.shades = g.userData.shades || []
  g.userData.shades.push(mesh.material)
}

/* ------------------------------ BEDS ------------------------------ */

function bedBase({ frameC, headC, duvetC, headH, headType }) {
  const g = group()
  // frame + legs
  g.add(box(1.6, 0.22, 2.1, wood(frameC), 0, 0.2, 0))
  ;[[-0.74, -0.98], [0.74, -0.98], [-0.74, 0.98], [0.74, 0.98]].forEach(([x, z]) =>
    g.add(box(0.07, 0.1, 0.07, wood(frameC), x, 0.05, z)),
  )
  // mattress, duvet and pillows
  g.add(rbox(1.5, 0.22, 2.0, 0.06, fabric(ivory), 0, 0.42, 0.02))
  g.add(rbox(1.54, 0.1, 1.35, 0.04, fabric(duvetC), 0, 0.58, 0.3))
  g.add(rbox(1.54, 0.16, 0.12, 0.05, fabric(duvetC), 0, 0.55, 0.98)) // fold at foot
  g.add(rbox(0.62, 0.14, 0.38, 0.06, fabric(cream), -0.4, 0.62, -0.78))
  g.add(rbox(0.62, 0.14, 0.38, 0.06, fabric('#F4E4E0'), 0.4, 0.62, -0.78))
  // headboard
  if (headType === 'slats') {
    g.add(box(1.66, 0.1, 0.08, wood(headC), 0, headH, -1.04))
    for (let i = -3; i <= 3; i++) g.add(box(0.07, headH - 0.2, 0.05, wood(headC), i * 0.23, headH / 2 + 0.05, -1.04))
  } else if (headType === 'padded') {
    g.add(rbox(1.7, headH, 0.14, 0.1, fabric(headC), 0, headH / 2 + 0.05, -1.05))
  } else {
    g.add(box(1.6, headH, 0.07, wood(headC), 0, headH / 2 + 0.1, -1.04))
    g.add(box(1.7, 0.06, 0.1, wood(headC), 0, headH + 0.1, -1.04))
  }
  return g
}

const bedClassic = () => bedBase({ frameC: walnut, headC: walnut, duvetC: rose, headH: 1.05, headType: 'slats' })
const bedUpholstered = () => bedBase({ frameC: PAINT, headC: rose, duvetC: sage, headH: 1.3, headType: 'padded' })
const bedPlatform = () => {
  const g = bedBase({ frameC: OAK, headC: OAK, duvetC: burgundy, headH: 0.8, headType: 'panel' })
  return g
}

/* ----------------------- BEDSIDE TABLES ----------------------- */

function tableDrawer() {
  const g = group()
  g.add(box(0.5, 0.42, 0.4, wood(walnut), 0, 0.37, 0))
  g.add(box(0.54, 0.04, 0.44, wood('#7A5A42'), 0, 0.6, 0))
  ;[[-0.2, -0.15], [0.2, -0.15], [-0.2, 0.15], [0.2, 0.15]].forEach(([x, z]) =>
    g.add(box(0.04, 0.16, 0.04, wood('#6B4D38'), x, 0.08, z)),
  )
  g.add(box(0.42, 0.14, 0.015, wood('#9A7658'), 0, 0.46, 0.2))
  g.add(sphere(0.02, metal(), 0, 0.46, 0.22))
  g.add(box(0.42, 0.14, 0.015, wood('#9A7658'), 0, 0.3, 0.2))
  g.add(sphere(0.02, metal(), 0, 0.3, 0.22))
  return g
}
function tableRound() {
  const g = group()
  g.add(cyl(0.24, 0.24, 0.035, wood(PALE), 0, 0.52, 0, 32))
  ;[0, 1, 2].forEach((i) => {
    const a = (i / 3) * Math.PI * 2
    const leg = cyl(0.015, 0.02, 0.5, metal('#9A8466'), Math.sin(a) * 0.14, 0.25, Math.cos(a) * 0.14)
    leg.rotation.z = Math.sin(a) * -0.12
    leg.rotation.x = Math.cos(a) * 0.12
    g.add(leg)
  })
  g.add(cyl(0.17, 0.17, 0.02, wood(PALE), 0, 0.2, 0, 32))
  return g
}
function tableOpen() {
  const g = group()
  g.add(box(0.52, 0.035, 0.4, wood(PAINT), 0, 0.55, 0))
  g.add(box(0.46, 0.03, 0.36, wood(PAINT), 0, 0.22, 0))
  g.add(box(0.035, 0.55, 0.38, wood(PAINT), -0.235, 0.275, 0))
  g.add(box(0.035, 0.55, 0.38, wood(PAINT), 0.235, 0.275, 0))
  g.add(box(0.46, 0.4, 0.02, wood('#E6DCCB'), 0, 0.3, -0.18))
  return g
}

/* ----------------------------- LAMPS ----------------------------- */

function lampCeramic() {
  const g = group()
  g.add(sphere(0.09, mat(sage, { rough: 0.35 }), 0, 0.1, 0, 1, 1.25, 1))
  g.add(cyl(0.02, 0.03, 0.12, mat(sage, { rough: 0.35 }), 0, 0.26, 0))
  const shade = cyl(0.1, 0.17, 0.2, glowShade(cream), 0, 0.4, 0, 24)
  markShade(shade, g)
  g.add(shade)
  return g
}
function lampShade() {
  const g = group()
  g.add(cyl(0.09, 0.1, 0.02, metal(), 0, 0.01, 0))
  g.add(cyl(0.01, 0.01, 0.3, metal(), 0, 0.17, 0))
  const shade = cyl(0.14, 0.14, 0.17, glowShade('#E9C7C0'), 0, 0.38, 0, 28)
  markShade(shade, g)
  g.add(shade)
  return g
}
function lampFloor() {
  const g = group()
  g.add(cyl(0.16, 0.18, 0.025, metal(charcoal), 0, 0.012, 0))
  g.add(cyl(0.012, 0.012, 1.4, metal(charcoal), 0, 0.72, 0))
  const shade = cyl(0.12, 0.2, 0.26, glowShade(ivory), 0, 1.5, 0, 28)
  markShade(shade, g)
  g.add(shade)
  return g
}

/* ----------------------------- RUGS ----------------------------- */

function rugRound() {
  const g = group()
  const base = cyl(0.9, 0.9, 0.02, fabric(cream), 0, 0.01, 0, 48)
  base.castShadow = false
  g.add(base)
  const ring = cyl(0.62, 0.62, 0.024, fabric(rose), 0, 0.012, 0, 48)
  ring.castShadow = false
  g.add(ring)
  const core = cyl(0.42, 0.42, 0.028, fabric(cream), 0, 0.014, 0, 48)
  core.castShadow = false
  g.add(core)
  return g
}
function rugRect() {
  const g = group()
  const a = box(2.0, 0.02, 1.4, fabric(sage), 0, 0.01, 0)
  const b = box(1.78, 0.024, 1.18, fabric(ivory), 0, 0.012, 0)
  const c = box(1.5, 0.028, 0.9, fabric(sage), 0, 0.014, 0)
  ;[a, b, c].forEach((m) => (m.castShadow = false))
  g.add(a, b, c)
  return g
}
function rugOval() {
  const g = group()
  const a = cyl(1, 1, 0.02, fabric(rose), 0, 0.01, 0, 48)
  a.scale.set(1.1, 1, 0.75)
  const b = cyl(0.7, 0.7, 0.024, fabric('#F2DCD6'), 0, 0.012, 0, 48)
  b.scale.set(1.1, 1, 0.75)
  ;[a, b].forEach((m) => (m.castShadow = false))
  g.add(a, b)
  return g
}
function rugStriped() {
  const g = group()
  for (let i = 0; i < 9; i++) {
    const c = i % 2 === 0 ? burgundy : cream
    const s = box(2.0, 0.02, 1.4 / 9, fabric(c), 0, 0.01, -0.7 + (i + 0.5) * (1.4 / 9))
    s.castShadow = false
    g.add(s)
  }
  return g
}

/* ----------------------------- PLANTS ----------------------------- */

function pot(r, h, color) {
  return cyl(r, r * 0.72, h, mat(color, { rough: 0.8 }), 0, h / 2, 0, 20)
}
function plantFiddle() {
  const g = group()
  g.add(pot(0.2, 0.36, PAINT))
  g.add(cyl(0.018, 0.025, 0.9, wood('#7A5A42'), 0, 0.8, 0))
  const spots = [[0, 1.35, 0], [0.14, 1.15, 0.05], [-0.14, 1.05, -0.05], [0.05, 0.9, 0.15], [-0.1, 1.25, 0.12], [0.1, 1.3, -0.12], [-0.05, 0.8, -0.14]]
  spots.forEach(([x, y, z], i) => {
    const l = sphere(0.14, mat(i % 2 ? LEAF : LEAF_DARK, { rough: 0.7 }), x, y, z, 1, 0.38, 0.8)
    l.rotation.set(0.3 * (i % 3 - 1), i, 0.5)
    g.add(l)
  })
  return g
}
function plantSnake() {
  const g = group()
  g.add(pot(0.17, 0.3, TERRACOTTA))
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2
    const h = 0.55 + (i % 3) * 0.18
    const blade = cyl(0.01, 0.05, h, mat(i % 2 ? LEAF_DARK : LEAF, { rough: 0.6 }), Math.sin(a) * 0.06, 0.3 + h / 2, Math.cos(a) * 0.06, 8)
    blade.scale.z = 0.4
    blade.rotation.z = Math.sin(a) * 0.12
    blade.rotation.x = Math.cos(a) * 0.12
    g.add(blade)
  }
  return g
}
function plantCactus() {
  const g = group()
  g.add(pot(0.09, 0.12, PAINT))
  g.add(cyl(0.05, 0.055, 0.2, mat(LEAF, { rough: 0.6 }), 0, 0.22, 0, 12))
  g.add(sphere(0.05, mat(LEAF, { rough: 0.6 }), 0, 0.32, 0))
  const arm = cyl(0.02, 0.02, 0.07, mat(LEAF, { rough: 0.6 }), 0.07, 0.27, 0, 10)
  g.add(arm)
  g.add(sphere(0.022, mat(LEAF, { rough: 0.6 }), 0.07, 0.31, 0))
  return g
}
function plantPothos() {
  const g = group()
  g.add(pot(0.09, 0.14, TERRACOTTA))
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2
    const r = 0.09 + (i % 3) * 0.03
    const y = 0.17 - (i % 3) * 0.06
    g.add(sphere(0.045, mat(i % 2 ? LEAF : LEAF_DARK, { rough: 0.7 }), Math.sin(a) * r, y, Math.cos(a) * r, 1, 0.5, 1))
  }
  g.add(sphere(0.09, mat(LEAF_DARK, { rough: 0.7 }), 0, 0.19, 0, 1, 0.6, 1))
  return g
}

/* ------------------------- WARDROBES ------------------------- */

function wardrobeTall() {
  const g = group()
  g.add(box(1.1, 2.0, 0.55, wood(walnut), 0, 1.0, 0))
  g.add(box(0.53, 1.9, 0.02, wood('#9A7658'), -0.27, 1.0, 0.28))
  g.add(box(0.53, 1.9, 0.02, wood('#9A7658'), 0.27, 1.0, 0.28))
  g.add(box(0.03, 0.2, 0.03, metal(), -0.05, 1.0, 0.31))
  g.add(box(0.03, 0.2, 0.03, metal(), 0.05, 1.0, 0.31))
  g.add(box(1.16, 0.05, 0.6, wood('#7A5A42'), 0, 2.02, 0))
  return g
}
function wardrobeOpen() {
  const g = group()
  const w = wood(PAINT)
  g.add(box(0.04, 1.9, 0.5, w, -0.43, 0.95, 0))
  g.add(box(0.04, 1.9, 0.5, w, 0.43, 0.95, 0))
  g.add(box(0.9, 0.04, 0.5, w, 0, 1.9, 0))
  g.add(box(0.9, 0.06, 0.5, w, 0, 0.05, 0))
  g.add(box(0.86, 1.9, 0.02, wood('#E4D9C6'), 0, 0.95, -0.24))
  g.add(box(0.86, 0.03, 0.46, w, 0, 1.1, 0))
  g.add(cyl(0.012, 0.012, 0.84, metal(), 0, 1.65, 0.0).rotateZ(Math.PI / 2))
  // a few clothes on the rail
  ;[rose, sage, burgundy, cream, '#C9B9A2'].forEach((c, i) => {
    g.add(box(0.05, 0.5, 0.3, fabric(c), -0.32 + i * 0.16, 1.38, 0))
  })
  g.add(box(0.4, 0.14, 0.3, fabric(cream), -0.2, 0.15, 0.02))
  g.add(box(0.3, 0.2, 0.3, fabric(rose), 0.2, 0.18, 0.02))
  return g
}
function wardrobeRounded() {
  const g = group()
  g.add(rbox(1.2, 1.85, 0.55, 0.22, mat(sage, { rough: 0.55 }), 0, 0.93, 0))
  g.add(rbox(0.54, 1.7, 0.02, 0.18, mat('#B1BFA3', { rough: 0.55 }), -0.29, 0.93, 0.28))
  g.add(rbox(0.54, 1.7, 0.02, 0.18, mat('#B1BFA3', { rough: 0.55 }), 0.29, 0.93, 0.28))
  g.add(sphere(0.025, metal(), -0.04, 0.9, 0.3))
  g.add(sphere(0.025, metal(), 0.04, 0.9, 0.3))
  ;[[-0.5, -0.2], [0.5, -0.2], [-0.5, 0.2], [0.5, 0.2]].forEach(([x, z]) =>
    g.add(cyl(0.025, 0.02, 0.1, wood(walnut), x, 0.03, z, 10)),
  )
  return g
}

/* --------------------------- SEATING --------------------------- */

function chairWood() {
  const g = group()
  const w = wood(OAK)
  g.add(box(0.46, 0.04, 0.44, w, 0, 0.45, 0))
  ;[[-0.2, -0.19], [0.2, -0.19], [-0.2, 0.19], [0.2, 0.19]].forEach(([x, z]) =>
    g.add(box(0.04, 0.44, 0.04, w, x, 0.22, z)),
  )
  g.add(box(0.04, 0.45, 0.04, w, -0.2, 0.7, -0.19))
  g.add(box(0.04, 0.45, 0.04, w, 0.2, 0.7, -0.19))
  g.add(box(0.44, 0.08, 0.03, w, 0, 0.88, -0.19))
  g.add(box(0.44, 0.08, 0.03, w, 0, 0.7, -0.19))
  g.add(rbox(0.4, 0.04, 0.38, 0.02, fabric(cream), 0, 0.49, 0.01))
  return g
}
function chairArmchair() {
  const g = group()
  g.add(rbox(0.8, 0.28, 0.74, 0.08, fabric(rose), 0, 0.3, 0.02))
  g.add(rbox(0.8, 0.5, 0.16, 0.08, fabric(rose), 0, 0.66, -0.3))
  g.add(rbox(0.14, 0.28, 0.7, 0.06, fabric('#C99590'), -0.35, 0.5, 0.03))
  g.add(rbox(0.14, 0.28, 0.7, 0.06, fabric('#C99590'), 0.35, 0.5, 0.03))
  g.add(rbox(0.5, 0.1, 0.5, 0.05, fabric('#E6BFB9'), 0, 0.5, 0.08))
  ;[[-0.32, -0.28], [0.32, -0.28], [-0.32, 0.3], [0.32, 0.3]].forEach(([x, z]) =>
    g.add(cyl(0.025, 0.018, 0.17, wood(walnut), x, 0.085, z, 10)),
  )
  return g
}
function chairPouf() {
  const g = group()
  g.add(cyl(0.26, 0.28, 0.38, fabric(burgundy), 0, 0.2, 0, 32))
  g.add(cyl(0.26, 0.26, 0.04, fabric('#7A4D58'), 0, 0.4, 0, 32))
  const band = cyl(0.285, 0.285, 0.03, fabric(cream), 0, 0.22, 0, 32)
  g.add(band)
  return g
}

/* ----------------------------- DECOR ----------------------------- */

function decorBooks() {
  const g = group()
  const cols = [burgundy, sage, cream, rose]
  const dims = [[0.26, 0.04, 0.18], [0.23, 0.035, 0.17], [0.24, 0.04, 0.16], [0.2, 0.03, 0.15]]
  let y = 0
  dims.forEach((d, i) => {
    const b = box(d[0], d[1], d[2], fabric(cols[i]), (i % 2 ? 0.01 : -0.01), y + d[1] / 2, 0)
    b.rotation.y = (i - 1.5) * 0.12
    g.add(b)
    y += d[1]
  })
  return g
}
function decorVase() {
  const g = group()
  const pts = [[0.001, 0], [0.05, 0], [0.065, 0.05], [0.06, 0.12], [0.03, 0.17], [0.035, 0.2], [0.001, 0.2]].map(
    ([x, y]) => new THREE.Vector2(x, y),
  )
  const vase = new THREE.Mesh(new THREE.LatheGeometry(pts, 20), mat(cream, { rough: 0.3 }))
  vase.castShadow = true
  g.add(vase)
  ;[[-0.03, 0.2, 0.01, 0.2], [0.02, 0.26, -0.01, -0.1], [0.04, 0.22, 0.02, -0.3], [-0.01, 0.3, 0, 0.05]].forEach(([x, h, z, tilt], i) => {
    const stem = cyl(0.004, 0.004, h + 0.12, mat('#8A7B5A'), x, 0.2 + h / 2, z, 6)
    stem.rotation.z = tilt
    g.add(stem)
    g.add(sphere(0.03, mat(i % 2 ? rose : '#EBD9B8', { rough: 0.8 }), x + Math.sin(tilt) * -(h / 2 + 0.06), 0.2 + h + 0.06, z, 1, 0.8, 1))
  })
  return g
}
function decorMirror() {
  const g = group()
  const tilt = group()
  tilt.add(box(0.62, 1.6, 0.04, wood(walnut), 0, 0.8, 0))
  const glass = box(0.54, 1.52, 0.012, mat('#DCE5E8', { rough: 0.05, metal: 0.55 }), 0, 0.8, 0.026)
  glass.castShadow = false
  tilt.add(glass)
  tilt.rotation.x = -0.1
  tilt.position.set(0, 0, 0.03)
  g.add(tilt)
  return g
}

/* ------------------------- WALL ART ------------------------- */

function makeArt(id) {
  const { w, h, frame } = ART_SIZES[id]
  const g = group()
  g.add(box(w, h, 0.035, wood(frame), 0, 0, 0))
  const texture = new THREE.CanvasTexture(makeArtCanvas(id))
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  const pw = w - 0.08
  const ph = h - 0.08
  const painting = new THREE.Mesh(
    new THREE.PlaneGeometry(pw, ph),
    new THREE.MeshStandardMaterial({ map: texture, roughness: 0.9 }),
  )
  painting.userData.ownMaterial = true
  painting.position.z = 0.019
  painting.receiveShadow = true
  g.add(painting)
  return g
}

export const MODELS = {
  'bed-classic': bedClassic,
  'bed-upholstered': bedUpholstered,
  'bed-platform': bedPlatform,
  'table-drawer': tableDrawer,
  'table-round': tableRound,
  'table-open': tableOpen,
  'lamp-ceramic': lampCeramic,
  'lamp-shade': lampShade,
  'lamp-floor': lampFloor,
  'rug-round': rugRound,
  'rug-rect': rugRect,
  'rug-oval': rugOval,
  'rug-striped': rugStriped,
  'plant-fiddle': plantFiddle,
  'plant-snake': plantSnake,
  'plant-cactus': plantCactus,
  'plant-pothos': plantPothos,
  'wardrobe-tall': wardrobeTall,
  'wardrobe-open': wardrobeOpen,
  'wardrobe-rounded': wardrobeRounded,
  'chair-wood': chairWood,
  'chair-armchair': chairArmchair,
  'chair-pouf': chairPouf,
  'decor-books': decorBooks,
  'decor-vase': decorVase,
  'decor-mirror': decorMirror,
  'art-arches': () => makeArt('art-arches'),
  'art-sun': () => makeArt('art-sun'),
  'art-botanical': () => makeArt('art-botanical'),
  'art-lines': () => makeArt('art-lines'),
  'art-moons': () => makeArt('art-moons'),
  'art-landscape': () => makeArt('art-landscape'),
  ...Object.fromEntries(['art-stripes', 'art-dots', 'art-face', 'art-waves', 'art-mountains', 'art-fruit'].map((id) => [id, () => makeArt(id)])),
}

export { wood, fabric, metal, glowShade, markShade, pot, bedBase }
