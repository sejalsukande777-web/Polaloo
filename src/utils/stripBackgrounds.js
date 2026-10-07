import { frameLibrary } from '../assets/assetLibrary.js'

// Every strip frame is painted at true pixel-art size (120x360 "art pixels")
// and scaled up with no smoothing — so the live preview and the exported
// image are identical. Photo windows come from frameLibrary.fourStripSlots.
export const ART_W = 120
export const ART_H = 360

const slots = () => frameLibrary.fourStripSlots.map((s) => ({
  x: Math.round(s.x * ART_W), y: Math.round(s.y * ART_H), w: Math.round(s.w * ART_W), h: Math.round(s.h * ART_H),
}))
const R = (c, col, x, y, w, h) => { c.fillStyle = col; c.fillRect(x, y, w, h) }
const plates = (c, col, pad = 2) => slots().forEach((s) => R(c, col, s.x - pad, s.y - pad, s.w + pad * 2, s.h + pad * 2))
const paint = (c, fn) => { for (let y = 0; y < ART_H; y++) for (let x = 0; x < ART_W; x++) { const col = fn(x, y); if (col) R(c, col, x, y, 1, 1) } }
const sprite = (c, rows, ox, oy, col, k = 1) => rows.forEach((r, y) => [...r].forEach((ch, x) => { if (ch === 'X') R(c, col, ox + x * k, oy + y * k, k, k) }))
const blob = (c, cx, cy, rx, ry, col) => { for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++) if ((x / rx) ** 2 + (y / ry) ** 2 <= 1) R(c, col, cx + x, cy + y, 1, 1) }
const rnd = (seed) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296)
const B4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
const STAR = ['..X..', '.XXX.', 'XXXXX', '.XXX.', '..X..']
const HEART = ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...']
const solid = (col) => (c) => { R(c, col, 0, 0, ART_W, ART_H); plates(c, '#fffdf8') }
const dots = (base, dot, plate, dark) => ({ render: (c) => { paint(c, (x, y) => ((x % 8 < 2 && y % 8 < 2) || ((x + 4) % 8 < 2 && (y + 4) % 8 < 2) ? dot : base)); plates(c, plate) }, dark })
const tile = (rowsFn, base, plate) => (c) => { R(c, base, 0, 0, ART_W, ART_H); for (let y = 0; y < ART_H; y += 16) for (let x = 0; x < ART_W; x += 16) rowsFn(c, x, y); plates(c, plate) }

export const backgroundOptions = [
  { id: 'gingham', label: 'Picnic', render: (c) => {
      paint(c, (x, y) => { const a = (x >> 2) & 1, b = (y >> 2) & 1; return a && b ? '#d9c8a4' : a || b ? '#ece1c9' : '#fbf6ea' })
      plates(c, '#fffdf6')
      R(c, '#e2d3b3', 2, 3, 30, 6); R(c, '#cdb98f', 2, 3, 30, 1)                                  // washi tape
      blob(c, 105, 6, 4, 4, '#8a6a4a'); blob(c, 104, 5, 2, 2, '#a98763'); R(c, '#5a4030', 104, 5, 1, 1); R(c, '#5a4030', 106, 7, 1, 1) // button
      R(c, '#cdb089', 30, 318, 60, 14); R(c, '#e0c7a1', 30, 318, 60, 1); sprite(c, HEART, 36, 322, '#c9806f'); R(c, '#e2d3b3', 84, 308, 28, 6)  // kraft label
    } },
  { id: 'cherry', label: 'Cherry', dark: true, render: (c) => {
      R(c, '#7a1224', 0, 0, ART_W, ART_H); plates(c, '#fff3ee')
      const r = rnd(5)
      for (let y = 312; y < 358; y++) for (let x = 6; x < 54; x++) {
        if (y < 316 + ((x * 5) % 7) + (x - 6) * 0.3) continue
        const a = ((x >> 1) & 1), b = ((y >> 1) & 1); R(c, a && b ? '#b3243b' : a || b ? '#e9b8bd' : '#fff3ee', x, y, 1, 1)
      }
      sprite(c, STAR, 2, 168, '#fff3ee', 3); sprite(c, STAR, 5, 171, '#7a1224', 2); r()
    } },
  { id: 'airmail', label: 'Airmail', render: (c) => {
      R(c, '#ead9b5', 0, 0, ART_W, ART_H)
      const seg = ['#c2402f', '#ead9b5', '#2b4a86', '#ead9b5']
      for (let i = 0; i < 120; i += 1) { const k = seg[(i >> 3) & 3]; R(c, k, i, 0, 1, 6); R(c, k, i, 354, 1, 6) }
      for (let i = 0; i < 360; i += 1) { const k = seg[(i >> 3) & 3]; R(c, k, 0, i, 6, 1); R(c, k, 114, i, 6, 1) }
      plates(c, '#f4ead0', 3); plates(c, '#fffdf0', 2)
      R(c, '#fff8e0', 84, 316, 24, 26); R(c, '#2b4a86', 87, 319, 18, 20); R(c, '#c2402f', 92, 325, 8, 8)  // stamp
      for (let x = 84; x < 108; x += 3) { R(c, '#ead9b5', x, 316, 1, 1); R(c, '#ead9b5', x, 341, 1, 1) }
    } },
  { id: 'meadow', label: 'Meadow', render: (c) => {
      const sky = ['#2872c4', '#3a8bd4', '#55a3e0', '#7bbfea', '#a2d5f1', '#c9e8f6']
      paint(c, (x, y) => { const p = Math.min(1, y / 330) * (sky.length - 1), b = Math.floor(p); return sky[b + 1 < sky.length && p - b > B4[(y & 3) * 4 + (x & 3)] / 16 ? b + 1 : b] })
      ;[[24, 82, 13], [92, 158, 14], [30, 234, 12], [96, 50, 8]].forEach(([x, y, r]) => { blob(c, x, y, r, 4, '#fbf6ea'); blob(c, x + 2, y + 2, r - 2, 2, '#dce8f2') })
      const gr = ['#86b05c', '#62975c', '#437f5e'], r = rnd(9)
      paint(c, (x, y) => (y >= 306 ? gr[Math.min(2, Math.floor((y - 306) / 18))] : null))
      for (let i = 0; i < 70; i++) R(c, ['#ffd23f', '#ff7fa8', '#fff6e8'][i % 3], Math.floor(r() * 118), 308 + Math.floor(r() * 50), 1, 1)
      plates(c, '#fffdf6')
    } },
  { id: 'pinkdots', label: 'Pink Dots', ...dots('#ff9fcf', '#fff6e9', '#fff6e9') },
  { id: 'blackdots', label: 'Black Dots', ...dots('#1a1226', '#fff6e9', '#fff6e9', true) },
  { id: 'hearts', label: 'Hearts', render: tile((c, x, y) => { sprite(c, HEART, x + 1, y + 1, '#ff7bb8'); sprite(c, HEART, x + 9, y + 9, '#fff6e9') }, '#ffc2de', '#fffdf8') },
  { id: 'stars', label: 'Stars', dark: true, render: tile((c, x, y) => { sprite(c, STAR, x + 1, y + 1, '#ffe58f'); R(c, '#8fd3ff', x + 11, y + 4, 1, 1); R(c, '#8fd3ff', x + 6, y + 11, 1, 1) }, '#2b1d4a', '#fff6e9') },
  { id: 'cream', label: 'Cream', render: solid('#fff6e9') },
  { id: 'blush', label: 'Bubblegum', render: solid('#ffc2de') },
  { id: 'mint', label: 'Mint', render: solid('#bff5de') },
  { id: 'lavender', label: 'Grape', render: solid('#d4c4ff') },
  { id: 'sky', label: 'Sky', render: solid('#bfe6ff') },
  { id: 'charcoal', label: 'Midnight', dark: true, render: solid('#2b1d4a') },
]

export function getBackgroundOption(id) {
  return backgroundOptions.find((o) => o.id === id) || backgroundOptions[0]
}

const canvasCache = {}, urlCache = {}
function artCanvas(option) {
  if (!canvasCache[option.id]) {
    const c = document.createElement('canvas')
    c.width = ART_W; c.height = ART_H
    option.render(c.getContext('2d'))
    canvasCache[option.id] = c
  }
  return canvasCache[option.id]
}

// Style for the live preview (square:true = swatch thumbnail showing the top of the strip)
export function cssBackgroundStyle(option, { square = false } = {}) {
  if (!urlCache[option.id]) urlCache[option.id] = artCanvas(option).toDataURL()
  return {
    backgroundImage: `url(${urlCache[option.id]})`,
    backgroundSize: square ? '100% auto' : '100% 100%',
    backgroundPosition: 'top center',
    imageRendering: 'pixelated',
  }
}

export function drawBackgroundOnCanvas(ctx, width, height, option) {
  ctx.save()
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(artCanvas(option), 0, 0, width, height)
  ctx.restore()
}
