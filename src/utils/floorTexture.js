// Floor textures are painted on a canvas: planks, parquet, tiles or deck boards.
// We make two images: the colour map and a grey "bump" map so the gaps between
// boards catch the light and the floor does not look flat.
import * as THREE from 'three'
import { ROOM_SIZE } from '../rooms/rooms.js'

const PX_W = 1024
const PX_H = Math.round((PX_W * ROOM_SIZE.D) / ROOM_SIZE.W)
const PX_PER_M = PX_W / ROOM_SIZE.W

// small seeded random generator so a floor always looks the same
function rng(seed) {
  let a = seed
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t))
const css = (c, k = 0) => `rgb(${c.map((v) => Math.max(0, Math.min(255, v + k))).join(',')})`

function board(ctx, bump, x, y, w, h, color, r, grain = true, vertical = true) {
  ctx.fillStyle = css(color)
  ctx.fillRect(x, y, w, h)
  const g = 120 + Math.round(r() * 30)
  bump.fillStyle = `rgb(${g},${g},${g})`
  bump.fillRect(x, y, w, h)
  if (grain) {
    const lines = Math.max(3, Math.floor((vertical ? w : h) / 4))
    for (let i = 0; i < lines; i++) {
      const off = r() * (vertical ? w : h)
      ctx.strokeStyle = r() > 0.5 ? `rgba(60,35,15,${0.04 + r() * 0.08})` : `rgba(255,240,215,${0.04 + r() * 0.07})`
      ctx.lineWidth = 0.6 + r() * 1.4
      ctx.beginPath()
      if (vertical) { ctx.moveTo(x + off, y); ctx.lineTo(x + off + (r() - 0.5) * 3, y + h) }
      else { ctx.moveTo(x, y + off); ctx.lineTo(x + w, y + off + (r() - 0.5) * 3) }
      ctx.stroke()
    }
    if (r() > 0.86) { // an occasional knot
      const kx = x + r() * w, ky = y + r() * h
      ctx.fillStyle = 'rgba(60,35,15,0.22)'
      ctx.beginPath(); ctx.ellipse(kx, ky, 3 + r() * 3, 5 + r() * 5, vertical ? 0 : Math.PI / 2, 0, Math.PI * 2); ctx.fill()
    }
  }
  // dark joint around the board
  ctx.strokeStyle = 'rgba(30,18,8,0.42)'
  ctx.lineWidth = 1.5
  ctx.strokeRect(x + 0.75, y + 0.75, w - 1.5, h - 1.5)
  bump.strokeStyle = 'rgb(20,20,20)'
  bump.lineWidth = 2.5
  bump.strokeRect(x + 1, y + 1, w - 2, h - 2)
}

export function makeFloorTextures(floor) {
  const color = document.createElement('canvas')
  const bumpC = document.createElement('canvas')
  color.width = bumpC.width = PX_W
  color.height = bumpC.height = PX_H
  const ctx = color.getContext('2d')
  const bump = bumpC.getContext('2d')
  const base = hex(floor.base)
  const dark = hex(floor.dark)
  const r = rng(floor.id.length * 977 + floor.base.charCodeAt(2))
  bump.fillStyle = 'rgb(128,128,128)'
  bump.fillRect(0, 0, PX_W, PX_H)
  const style = floor.style || 'planks'

  if (style === 'planks' || style === 'deck') {
    const count = floor.planks || 24
    const pw = PX_W / count
    for (let i = 0; i < count; i++) {
      let y = -r() * 1.4 * PX_PER_M
      while (y < PX_H) {
        const len = (1.0 + r() * 1.5) * PX_PER_M
        board(ctx, bump, i * pw, y, pw, len, mix(base, dark, r() * 0.9), r, true, true)
        y += len
      }
    }
  } else if (style === 'parquet') {
    const block = 0.6 * PX_PER_M
    const slats = 4
    for (let by = 0; by * block < PX_H; by++) {
      for (let bx = 0; bx * block < PX_W; bx++) {
        const vertical = (bx + by) % 2 === 0
        for (let s = 0; s < slats; s++) {
          const t = block / slats
          const x = bx * block + (vertical ? s * t : 0)
          const y = by * block + (vertical ? 0 : s * t)
          board(ctx, bump, x, y, vertical ? t : block, vertical ? block : t, mix(base, dark, r() * (vertical ? 0.6 : 1)), r, true, vertical)
        }
      }
    }
  } else {
    // tile and checker
    const size = (style === 'checker' ? 0.5 : 0.6) * PX_PER_M
    const grout = floor.grout || '#D8D0C4'
    ctx.fillStyle = grout
    ctx.fillRect(0, 0, PX_W, PX_H)
    bump.fillStyle = 'rgb(40,40,40)'
    bump.fillRect(0, 0, PX_W, PX_H)
    const gap = 3
    for (let ty = 0; ty * size < PX_H; ty++) {
      for (let tx = 0; tx * size < PX_W; tx++) {
        const c = style === 'checker' ? ((tx + ty) % 2 ? dark : base) : mix(base, dark, r() * 0.7)
        ctx.fillStyle = css(c)
        ctx.fillRect(tx * size + gap, ty * size + gap, size - gap * 2, size - gap * 2)
        bump.fillStyle = 'rgb(150,150,150)'
        bump.fillRect(tx * size + gap, ty * size + gap, size - gap * 2, size - gap * 2)
        if (style === 'tile') { // soft veining
          for (let k = 0; k < 4; k++) {
            ctx.strokeStyle = `rgba(255,255,255,${0.05 + r() * 0.1})`
            ctx.lineWidth = 1 + r() * 2
            ctx.beginPath()
            const sx = tx * size + r() * size, sy = ty * size + r() * size
            ctx.moveTo(sx, sy)
            ctx.quadraticCurveTo(sx + (r() - 0.5) * 120, sy + (r() - 0.5) * 120, sx + (r() - 0.5) * 160, sy + (r() - 0.5) * 160)
            ctx.stroke()
          }
        }
      }
    }
  }

  const map = new THREE.CanvasTexture(color)
  map.colorSpace = THREE.SRGBColorSpace
  map.anisotropy = 8
  const bumpMap = new THREE.CanvasTexture(bumpC)
  bumpMap.anisotropy = 8
  return { map, bumpMap, rough: style === 'tile' || style === 'checker' ? 0.35 : style === 'deck' ? 0.9 : 0.62 }
}
