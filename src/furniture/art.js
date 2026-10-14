// Wall-art paintings are drawn onto a 2D canvas, then used as a texture in 3D
// (and as a thumbnail in the catalog). Colours follow the ROOMLY palette.
import { BRAND } from '../data/palette.js'

const { ivory, cream, rose, sage, burgundy, walnut, charcoal } = BRAND

export const ART_DRAW = {
  'art-arches'(ctx, w, h) {
    ctx.fillStyle = cream
    ctx.fillRect(0, 0, w, h)
    const arch = (cx, bw, bh, color) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(cx - bw / 2, h * 0.88)
      ctx.lineTo(cx - bw / 2, h * 0.88 - bh + bw / 2)
      ctx.arc(cx, h * 0.88 - bh + bw / 2, bw / 2, Math.PI, 0)
      ctx.lineTo(cx + bw / 2, h * 0.88)
      ctx.closePath()
      ctx.fill()
    }
    arch(w * 0.5, w * 0.62, h * 0.7, rose)
    arch(w * 0.5, w * 0.42, h * 0.5, burgundy)
    arch(w * 0.5, w * 0.22, h * 0.3, sage)
  },
  'art-sun'(ctx, w, h) {
    ctx.fillStyle = ivory
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = rose
    ctx.beginPath()
    ctx.arc(w / 2, h * 0.48, w * 0.28, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = burgundy
    ctx.fillRect(0, h * 0.72, w, h * 0.28)
    ctx.fillStyle = sage
    ctx.beginPath()
    ctx.moveTo(0, h * 0.72)
    ctx.quadraticCurveTo(w * 0.3, h * 0.55, w * 0.62, h * 0.72)
    ctx.fill()
  },
  'art-botanical'(ctx, w, h) {
    ctx.fillStyle = '#F1EADD'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = walnut
    ctx.lineWidth = w * 0.012
    ctx.beginPath()
    ctx.moveTo(w * 0.5, h * 0.92)
    ctx.quadraticCurveTo(w * 0.46, h * 0.5, w * 0.55, h * 0.1)
    ctx.stroke()
    for (let i = 0; i < 7; i++) {
      const t = i / 6
      const y = h * (0.82 - t * 0.66)
      const x = w * (0.5 + Math.sin(t * 2) * 0.03)
      const side = i % 2 ? 1 : -1
      ctx.fillStyle = i % 3 === 0 ? sage : '#7F9172'
      ctx.beginPath()
      ctx.ellipse(x + side * w * 0.12, y, w * 0.13, h * 0.045, side * -0.5, 0, Math.PI * 2)
      ctx.fill()
    }
  },
  'art-lines'(ctx, w, h) {
    ctx.fillStyle = '#E8D6CC'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = charcoal
    ctx.lineWidth = w * 0.012
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(w * 0.2, h * 0.7)
    ctx.bezierCurveTo(w * 0.35, h * 0.2, w * 0.55, h * 0.9, w * 0.8, h * 0.35)
    ctx.stroke()
    ctx.strokeStyle = burgundy
    ctx.beginPath()
    ctx.arc(w * 0.62, h * 0.62, w * 0.12, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = sage
    ctx.beginPath()
    ctx.arc(w * 0.3, h * 0.3, w * 0.07, 0, Math.PI * 2)
    ctx.fill()
  },
  'art-moons'(ctx, w, h) {
    ctx.fillStyle = charcoal
    ctx.fillRect(0, 0, w, h)
    const r = h * 0.28
    ;[0.2, 0.5, 0.8].forEach((cx, i) => {
      ctx.fillStyle = cream
      ctx.beginPath()
      ctx.arc(w * cx, h / 2, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = charcoal
      ctx.beginPath()
      ctx.arc(w * cx + r * (0.2 + i * 0.35), h / 2, r * 0.95, 0, Math.PI * 2)
      ctx.fill()
    })
  },
  'art-landscape'(ctx, w, h) {
    const sky = ctx.createLinearGradient(0, 0, 0, h)
    sky.addColorStop(0, '#F3D9CF')
    sky.addColorStop(1, '#F7F0E4')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = rose
    ctx.beginPath()
    ctx.arc(w * 0.72, h * 0.38, h * 0.13, 0, Math.PI * 2)
    ctx.fill()
    const hill = (color, base, amp, off) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(0, h)
      for (let x = 0; x <= w; x += 6) ctx.lineTo(x, h * base + Math.sin(x / w * 5 + off) * h * amp)
      ctx.lineTo(w, h)
      ctx.fill()
    }
    hill(sage, 0.58, 0.06, 0)
    hill('#7F9172', 0.72, 0.05, 2)
    hill(burgundy, 0.86, 0.04, 4)
  },
  'art-stripes'(ctx, w, h) {
    const cols = [rose, '#E8C9B0', cream, sage, '#7F9172', burgundy]
    cols.forEach((c, i) => {
      ctx.fillStyle = c
      ctx.fillRect(0, (h / cols.length) * i, w, h / cols.length + 1)
    })
  },
  'art-dots'(ctx, w, h) {
    ctx.fillStyle = ivory
    ctx.fillRect(0, 0, w, h)
    const cols = [burgundy, rose, sage, '#C9B9A2', charcoal]
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      ctx.fillStyle = cols[(r * 3 + c * 2) % cols.length]
      ctx.beginPath()
      ctx.arc(w * (0.16 + c * 0.226), h * (0.16 + r * 0.226), w * 0.075, 0, Math.PI * 2)
      ctx.fill()
    }
  },
  'art-face'(ctx, w, h) {
    ctx.fillStyle = '#EFE3D3'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = rose
    ctx.beginPath()
    ctx.ellipse(w * 0.5, h * 0.42, w * 0.22, h * 0.26, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = burgundy
    ctx.beginPath()
    ctx.moveTo(w * 0.26, h * 0.44)
    ctx.quadraticCurveTo(w * 0.3, h * 0.08, w * 0.62, h * 0.14)
    ctx.quadraticCurveTo(w * 0.8, h * 0.3, w * 0.74, h * 0.5)
    ctx.quadraticCurveTo(w * 0.62, h * 0.26, w * 0.4, h * 0.3)
    ctx.fill()
    ctx.fillStyle = sage
    ctx.fillRect(w * 0.4, h * 0.66, w * 0.2, h * 0.34)
  },
  'art-waves'(ctx, w, h) {
    ctx.fillStyle = '#E9DDCB'
    ctx.fillRect(0, 0, w, h)
    ;[burgundy, rose, sage, charcoal].forEach((c, i) => {
      ctx.strokeStyle = c
      ctx.lineWidth = w * 0.035
      ctx.beginPath()
      for (let x = 0; x <= w; x += 5) {
        const y = h * (0.28 + i * 0.16) + Math.sin(x / w * 6.5 + i) * h * 0.05
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()
    })
  },
  'art-mountains'(ctx, w, h) {
    const sky = ctx.createLinearGradient(0, 0, 0, h)
    sky.addColorStop(0, '#F2D6CB')
    sky.addColorStop(1, '#F7EFE2')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, w, h)
    const peak = (cx, top, bw, color) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(cx - bw / 2, h)
      ctx.lineTo(cx, top)
      ctx.lineTo(cx + bw / 2, h)
      ctx.fill()
    }
    peak(w * 0.3, h * 0.28, w * 0.7, rose)
    peak(w * 0.68, h * 0.38, w * 0.7, sage)
    peak(w * 0.5, h * 0.6, w * 0.8, burgundy)
  },
  'art-fruit'(ctx, w, h) {
    ctx.fillStyle = '#F2E8D8'
    ctx.fillRect(0, 0, w, h)
    ;[[0.32, 0.55, 0.17, '#C55A4A'], [0.64, 0.5, 0.15, '#E3B04B'], [0.5, 0.74, 0.14, sage]].forEach(([x, y, r, c]) => {
      ctx.fillStyle = c
      ctx.beginPath()
      ctx.arc(w * x, h * y, w * r, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.strokeStyle = walnut
    ctx.lineWidth = w * 0.015
    ctx.beginPath()
    ctx.moveTo(w * 0.32, h * 0.4)
    ctx.lineTo(w * 0.34, h * 0.3)
    ctx.stroke()
  },
}

// width, height (metres), frame colour
export const ART_SIZES = {
  'art-arches': { w: 0.7, h: 0.95, frame: walnut },
  'art-sun': { w: 0.75, h: 0.75, frame: ivory },
  'art-botanical': { w: 0.6, h: 0.9, frame: charcoal },
  'art-lines': { w: 0.8, h: 0.6, frame: walnut },
  'art-moons': { w: 1.3, h: 0.5, frame: ivory },
  'art-landscape': { w: 1.1, h: 0.7, frame: charcoal },
  'art-stripes': { w: 0.9, h: 0.6, frame: ivory },
  'art-dots': { w: 0.7, h: 0.7, frame: walnut },
  'art-face': { w: 0.6, h: 0.8, frame: charcoal },
  'art-waves': { w: 1.0, h: 0.6, frame: walnut },
  'art-mountains': { w: 0.8, h: 0.55, frame: ivory },
  'art-fruit': { w: 0.6, h: 0.6, frame: walnut },
}

export function makeArtCanvas(id, pxPerMeter = 260) {
  const { w, h } = ART_SIZES[id]
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(w * pxPerMeter)
  canvas.height = Math.round(h * pxPerMeter)
  ART_DRAW[id](canvas.getContext('2d'), canvas.width, canvas.height)
  return canvas
}
