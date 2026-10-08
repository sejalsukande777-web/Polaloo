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
const STAR9 = ['....X....', '....X....', '...XXX...', 'XXXXXXXXX', '.XXXXXXX.', '..XXXXX..', '.XXX.XXX.', '.XX...XX.']
const STAR5 = ['..X..', '.XXX.', 'XXXXX', '.XXX.', '.X.X.']
const HEART = ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...']

const ring = (c, cx, cy, r, col) => { for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) { const d = Math.hypot(x, y); if (d <= r + 0.3 && d >= r - 1.2) R(c, col, cx + x, cy + y, 1, 1) } }
const spritePal = (c, rows, ox, oy, pal) => rows.forEach((r, y) => [...r].forEach((ch, x) => { if (pal[ch]) R(c, pal[ch], ox + x, oy + y, 1, 1) }))
const DAISY = ['..W..', '.WWW.', 'WWOWW', '.WWW.', '..W..']
const BERRY = ['.GGGGG.', '.RRGRR.', 'RRRRRRR', 'RYRRYRR', 'RRRYRRR', '.RYRRR.', '..RRR..', '...R...']

// A big-eyed pixel girl peeking up from the footer (cropped by the strip's bottom edge).
function girl(c, cx, o = {}) {
  const { hair = '#1a1226', hi = '#4a3d6e', skin = '#ffe0cf', iris = '#6b3a1f', glasses = null, bun = false, flower = false } = o
  const y0 = 313
  if (bun) { blob(c, cx + 13, y0 + 3, 7, 6, hair); R(c, hi, cx + 10, y0, 4, 1) }
  blob(c, cx, y0 + 12, 23, 13, hair); R(c, hair, cx - 23, y0 + 12, 46, 48)
  blob(c, cx, y0 + 30, 17, 17, skin); R(c, skin, cx - 17, y0 + 30, 34, 30)
  const bang = [5, 7, 8, 7, 6, 8, 9, 8, 6, 7, 6, 4]
  bang.forEach((n, i) => R(c, hair, cx - 18 + i * 3, y0 + 10, 3, n + 4))
  R(c, hi, cx - 14, y0 + 4, 9, 1); R(c, hi, cx + 2, y0 + 5, 7, 1); R(c, hi, cx - 21, y0 + 20, 1, 12); R(c, hi, cx + 20, y0 + 22, 1, 10)
  const eye = (ex, ey, left) => {
    blob(c, ex, ey, 4, 5, '#ffffff'); blob(c, ex, ey + 1, 3, 4, iris)
    R(c, '#1a1226', ex - 1, ey, 3, 3); R(c, '#ffffff', ex - 2, ey - 2, 2, 2); R(c, '#ffffff', ex + 1, ey + 2, 1, 1)
    R(c, '#1a1226', ex - 5, ey - 5, 11, 1); R(c, '#1a1226', left ? ex - 6 : ex + 6, ey - 6, 1, 2)
  }
  eye(cx - 10, y0 + 29, true); eye(cx + 10, y0 + 29, false)
  blob(c, cx - 15, y0 + 37, 3, 2, '#ffb3bd'); blob(c, cx + 15, y0 + 37, 3, 2, '#ffb3bd')
  R(c, '#e8a898', cx, y0 + 37, 1, 1); R(c, '#c4605a', cx - 2, y0 + 43, 5, 1); R(c, '#c4605a', cx - 1, y0 + 44, 3, 1)
  if (glasses) { ring(c, cx - 10, y0 + 29, 7, glasses); ring(c, cx + 10, y0 + 29, 7, glasses); R(c, glasses, cx - 3, y0 + 28, 7, 1) }
  if (flower) { [[0, -1], [-1, 0], [1, 0], [0, 1]].forEach(([dx, dy]) => R(c, '#ff9ec7', cx - 19 + dx * 2, y0 + 9 + dy * 2, 2, 2)); R(c, '#ffe58f', cx - 19, y0 + 9, 2, 2) }
}

const BOW = ['XXX...XXX', 'XXXX.XXXX', 'XXXKKKXXX', 'XXXX.XXXX', 'XXX...XXX']
// Gingham "picnic cloth" frames in pastel colours: stitched border, washi tape, bow, label card, daisies.
const picnic = (id, label, [l, m, d], a, a2) => ({ id, label, render: (c) => {
  paint(c, (x, y) => { const p = (x >> 2) & 1, q = (y >> 2) & 1; return p && q ? d : p || q ? m : l })
  plates(c, '#fffdf8')
  for (let y = 4; y < 356; y += 4) { R(c, a, 4, y, 1, 2); R(c, a, 115, y, 1, 2) }
  for (let x = 8; x < 112; x += 4) { R(c, a, x, 4, 2, 1); R(c, a, x, 355, 2, 1) }
  R(c, a2, 2, 1, 30, 7); for (let x = 4; x < 31; x += 4) R(c, '#ffffff', x, 3, 1, 3)
  spritePal(c, BOW, 100, 1, { X: a, K: a2 })
  R(c, '#fffdf8', 26, 316, 68, 18); R(c, a, 26, 316, 68, 1); R(c, a, 26, 333, 68, 1)
  sprite(c, HEART, 33, 322, a); sprite(c, HEART, 80, 322, a); spritePal(c, DAISY, 57, 321, { W: a2, O: '#ffe27a' })
  spritePal(c, DAISY, 8, 310, { W: '#fffdf8', O: a2 }); spritePal(c, DAISY, 107, 308, { W: '#fffdf8', O: a2 })
  R(c, a2, 84, 346, 30, 7); for (let x = 86; x < 113; x += 4) R(c, '#ffffff', x, 348, 1, 3)
} })
const cowSpots = (c, col, seed, n) => { const r = rnd(seed); for (let i = 0; i < n; i++) { const x = Math.floor(r() * 120), y = Math.floor(r() * 360), k = 2 + Math.floor(r() * 3); blob(c, x, y, 3 + k, 1 + k, col); blob(c, x + k, y - 1, 2 + k, k + 1, col); blob(c, x - k, y + 1, k + 2, k, col) } }
const solid = (col) => (c) => { R(c, col, 0, 0, ART_W, ART_H); plates(c, '#fffdf8') }
const dots = (base, dot, plate, dark) => ({ render: (c) => { paint(c, (x, y) => ((x % 8 < 2 && y % 8 < 2) || ((x + 4) % 8 < 2 && (y + 4) % 8 < 2) ? dot : base)); plates(c, plate) }, dark })
const tile = (rowsFn, base, plate) => (c) => { R(c, base, 0, 0, ART_W, ART_H); for (let y = 0; y < ART_H; y += 16) for (let x = 0; x < ART_W; x += 16) rowsFn(c, x, y); plates(c, plate) }

export const backgroundOptions = [
  picnic('gingham', 'Picnic', ['#fbf6ea', '#ece1c9', '#d9c8a4'], '#c9a97a', '#e0c7a1'),
  picnic('picnicpink', 'Picnic Pink', ['#fff1f6', '#ffd3e3', '#ffb0cd'], '#ff6fa5', '#ff9ec7'),
  picnic('picnicmint', 'Picnic Mint', ['#f1fff8', '#cdf3e1', '#9fe3c4'], '#4fc79a', '#7fdcb9'),
  picnic('picnicblue', 'Picnic Blue', ['#f1f8ff', '#cfe6fb', '#a3d0f4'], '#5aa9e6', '#8cc6f0'),
  picnic('picniclilac', 'Picnic Lilac', ['#f7f3ff', '#e0d4fb', '#c8b4f4'], '#9a7bea', '#b9a1f2'),
  picnic('picnicbutter', 'Picnic Butter', ['#fffbe6', '#fff0b0', '#ffe27a'], '#f2b01e', '#ffd04a'),
  { id: 'cherry', label: 'Cherry', dark: true, render: (c) => {
      R(c, '#7a1224', 0, 0, ART_W, ART_H); plates(c, '#fff3ee')
      const r = rnd(5)
      for (let y = 312; y < 358; y++) for (let x = 6; x < 54; x++) {
        if (y < 316 + ((x * 5) % 7) + (x - 6) * 0.3) continue
        const a = ((x >> 1) & 1), b = ((y >> 1) & 1); R(c, a && b ? '#b3243b' : a || b ? '#e9b8bd' : '#fff3ee', x, y, 1, 1)
      }
      r()
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
  { id: 'butter', label: 'Butter Girl', dateAlign: 'left', render: (c) => {
      R(c, '#fff0a6', 0, 0, ART_W, ART_H)
      for (let y = 0; y < ART_H; y += 16) for (let x = 0; x < ART_W; x += 16) { spritePal(c, DAISY, x + 1, y + 1, { W: '#fffdf8', O: '#ff9e6b' }); R(c, '#ffb3c6', x + 11, y + 10, 2, 2) }
      plates(c, '#fffdf8'); girl(c, 84, { hair: '#7a4a2a', hi: '#a06a40', flower: true })
    } },
  { id: 'lilac', label: 'Lilac Lace', dateAlign: 'left', render: (c) => {
      R(c, '#e9defe', 0, 0, ART_W, ART_H)
      for (let y = 4; y < ART_H; y += 12) for (let x = (y / 12) % 2 ? 2 : 8; x < ART_W; x += 12) R(c, '#fffdf8', x, y, 2, 2)
      R(c, '#5d4a86', 0, 0, ART_W, 6); for (let x = 3; x < ART_W; x += 6) blob(c, x, 6, 3, 3, '#5d4a86'); for (let x = 3; x < ART_W; x += 6) R(c, '#e9defe', x, 2, 1, 1)
      plates(c, '#fffdf8'); girl(c, 84, { hair: '#1a1226', iris: '#3a6b4a' })
    } },
  { id: 'bluebell', label: 'Bluebell', dateAlign: 'right', render: (c) => {
      R(c, '#bcc8f4', 0, 0, ART_W, ART_H); R(c, '#fff3b0', 0, 304, ART_W, 56)
      for (let y = 4; y < 300; y += 8) { R(c, '#fffdf8', 4, y, 2, 2); R(c, '#fffdf8', 114, y, 2, 2) }
      plates(c, '#fffdf8'); girl(c, 36, { hair: '#5a3a24', hi: '#8a5a3a', flower: true, iris: '#5a3a24' })
    } },
  { id: 'noirgirl', label: 'Night Girl', dark: true, dateAlign: 'left', render: (c) => {
      paint(c, (x, y) => ((x % 8 < 2 && y % 8 < 2) || ((x + 4) % 8 < 2 && (y + 4) % 8 < 2) ? '#fff6e9' : '#1a1226'))
      for (let i = 0; i < 18; i++) R(c, '#ffb3c6', 120 - i, 342 + (i >> 1), i, 1)
      plates(c, '#fff6e9'); girl(c, 84, { hair: '#2b2140', hi: '#6a5a96', glasses: '#d63a4a', iris: '#4a2a18' })
    } },
  { id: 'cherrygirl', label: 'Cherry Girl', dark: true, dateAlign: 'right', render: (c) => {
      R(c, '#8a1022', 0, 0, ART_W, ART_H)
      for (let y = 3; y < ART_H; y += 6) for (let x = (y / 6) % 2 ? 1 : 4; x < ART_W; x += 6) R(c, '#fff3ee', x, y, 1, 1)
      plates(c, '#fff3ee'); girl(c, 36, { hair: '#4a2a18', hi: '#7a4a2a', bun: true, iris: '#4a2a18' })
    } },
  { id: 'cowpink', label: 'Cow Print', render: (c) => { R(c, '#fffdf8', 0, 0, ART_W, ART_H); cowSpots(c, '#1a1226', 7, 46); plates(c, '#ff9ec7', 3); plates(c, '#fffdf8', 2) } },
  { id: 'pinkcow', label: 'Pink Cow', render: (c) => { R(c, '#ffe3ee', 0, 0, ART_W, ART_H); cowSpots(c, '#ff9ec7', 12, 46); plates(c, '#fffdf8', 2) } },
  { id: 'strawberry', label: 'Strawberry', render: tile((c, x, y) => { spritePal(c, BERRY, x + 1, y + 1, { G: '#4caf50', R: '#e8394f', Y: '#ffe58f' }); R(c, '#fffdf8', x + 11, y + 11, 2, 2); R(c, '#fffdf8', x + 5, y + 13, 1, 1) }, '#ffd6e4', '#fffdf8') },
  { id: 'confetti', label: 'Confetti', render: (c) => {
      R(c, '#fff8ec', 0, 0, ART_W, ART_H); const r = rnd(33), cols = ['#ffb3c6', '#ffe58f', '#b9e6ff', '#c9b6ff', '#a8efc8', '#ffc59a']
      for (let i = 0; i < 110; i++) { const x = Math.floor(r() * 118), y = Math.floor(r() * 358); R(c, cols[i % 6], x, y, 1 + (i % 3 === 0 ? 1 : 0), 1 + (i % 3 === 0 ? 1 : 0)) }
      for (let i = 0; i < 14; i++) { const x = 3 + Math.floor(r() * 112), y = 3 + Math.floor(r() * 352); R(c, '#ffd23f', x, y - 1, 1, 3); R(c, '#ffd23f', x - 1, y, 3, 1) }
      plates(c, '#fffdf8')
    } },
  { id: 'sunset', label: 'Sunset', render: (c) => {
      const g = ['#2b1d4a', '#5a3a8f', '#b04a9a', '#f0688a', '#ff9e6b', '#ffd37a'], r = rnd(4)
      paint(c, (x, y) => { const p = (y / ART_H) * (g.length - 1), b = Math.floor(p); return g[b + 1 < g.length && p - b > B4[(y & 3) * 4 + (x & 3)] / 16 ? b + 1 : b] })
      for (let i = 0; i < 40; i++) R(c, '#fffdf8', Math.floor(r() * 119), Math.floor(r() * 150), 1, 1)
      plates(c, '#fffdf8')
    } },
  { id: 'pinkdots', label: 'Pink Pop', render: (c) => {
      R(c, '#ffb6d5', 0, 0, ART_W, ART_H)
      for (let j = 0; j < 31; j++) for (let k = 0; k < 11; k++) { const cx = 6 + k * 12 + (j % 2) * 6, cy = 4 + j * 12; blob(c, cx, cy, 3, 3, '#fffdf8'); R(c, '#ff6fa5', cx + 5, cy + 5, 2, 2) }
      plates(c, '#fffdf8'); spritePal(c, BOW, 100, 1, { X: '#ff6fa5', K: '#d6579b' })
    } },
  { id: 'blackdots', label: 'Black Dots', ...dots('#1a1226', '#fff6e9', '#fff6e9', true) },
  { id: 'hearts', label: 'Hearts', render: tile((c, x, y) => { sprite(c, HEART, x + 1, y + 1, '#ff7bb8'); sprite(c, HEART, x + 9, y + 9, '#fff6e9') }, '#ffc2de', '#fffdf8') },
  { id: 'stars', label: 'Stars', dark: true, render: tile((c, x, y) => { sprite(c, STAR9, x + 1, y + 1, '#ffd23f'); R(c, '#fff3a8', x + 4, y + 3, 1, 3); sprite(c, STAR5, x + 11, y + 9, '#8fd3ff'); R(c, '#fffdf8', x + 5, y + 13, 1, 1); R(c, '#ff9ec7', x + 13, y + 3, 1, 1) }, '#2b1d4a', '#fff6e9') },
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
