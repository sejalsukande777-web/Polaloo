function clamp(v) {
  return v < 0 ? 0 : v > 255 ? 255 : v
}

function grayscaleValue(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b
}

const filterFns = {
  original(data) {
    return data
  },
  bw(data) {
    const d = data.data
    for (let i = 0; i < d.length; i += 4) {
      const g = grayscaleValue(d[i], d[i + 1], d[i + 2])
      d[i] = d[i + 1] = d[i + 2] = g
    }
    return data
  },
  vintage(data) {
    const d = data.data
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2]
      d[i] = clamp(r * 0.62 + g * 0.32 + b * 0.06 + 25)
      d[i + 1] = clamp(r * 0.35 + g * 0.55 + b * 0.1 + 15)
      d[i + 2] = clamp(r * 0.27 + g * 0.25 + b * 0.4)
    }
    return data
  },
  film(data) {
    const d = data.data
    for (let i = 0; i < d.length; i += 4) {
      d[i] = clamp(d[i] * 1.05 + 8)
      d[i + 1] = clamp(d[i + 1] * 1.0 + 4)
      d[i + 2] = clamp(d[i + 2] * 0.92)
      const noise = (Math.random() - 0.5) * 18
      d[i] = clamp(d[i] + noise)
      d[i + 1] = clamp(d[i + 1] + noise)
      d[i + 2] = clamp(d[i + 2] + noise)
    }
    return data
  },
  warm(data) {
    const d = data.data
    for (let i = 0; i < d.length; i += 4) {
      d[i] = clamp(d[i] * 1.12 + 10)
      d[i + 1] = clamp(d[i + 1] * 1.03)
      d[i + 2] = clamp(d[i + 2] * 0.85)
    }
    return data
  },
  cool(data) {
    const d = data.data
    for (let i = 0; i < d.length; i += 4) {
      d[i] = clamp(d[i] * 0.88)
      d[i + 1] = clamp(d[i + 1] * 1.0)
      d[i + 2] = clamp(d[i + 2] * 1.15 + 8)
    }
    return data
  },
  dreamy(data) {
    const d = data.data
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2]
      d[i] = clamp(r * 0.9 + 30)
      d[i + 1] = clamp(g * 0.9 + 25)
      d[i + 2] = clamp(b * 0.95 + 35)
    }
    return data
  },
  retro(data) {
    const d = data.data
    const levels = 5
    const step = 255 / (levels - 1)
    for (let i = 0; i < d.length; i += 4) {
      d[i] = clamp(Math.round((d[i] * 1.08) / step) * step)
      d[i + 1] = clamp(Math.round((d[i + 1] * 0.95) / step) * step)
      d[i + 2] = clamp(Math.round((d[i + 2] * 1.05) / step) * step)
    }
    return data
  },
}


// ---------------------------------------------------------------------------
// PIXEL FILTERS
// Resolution-independent: the photo is averaged into a fixed grid of
// `cols` blocks across, so preview and export look identical.
// ---------------------------------------------------------------------------
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
const bayer = (x, y) => (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16 - 0.5

const RAMPS = {
  gameboy: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'].map(hex),
  candy: ['#2b1b3d', '#7a4a9e', '#e0679a', '#ffb7c9', '#fff3e0'].map(hex),
  bitmap: ['#1a1226', '#fff6e9'].map(hex),
}
const ARCADE = [
  '#000000', '#1d2b53', '#7e2553', '#008751', '#ab5236', '#5f574f', '#c2c3c7', '#fff1e8',
  '#ff004d', '#ffa300', '#ffec27', '#00e436', '#29adff', '#83769c', '#ff77a8', '#ffccaa',
].map(hex)

// Brightness ramp: luminance (+ dither) picks a color from a dark->light list.
function rampMode(ramp, spread) {
  return (c, x, y) => {
    const l = grayscaleValue(c[0], c[1], c[2]) / 255
    const v = l + bayer(x, y) * spread
    const i = Math.min(ramp.length - 1, Math.max(0, Math.floor(v * ramp.length)))
    return ramp[i]
  }
}
// Nearest palette color with ordered dithering.
// Retro "cube" palette: N levels per channel (4 -> 64 colors) + ordered dither.
function cubeMode(levels, spread) {
  const step = 255 / (levels - 1)
  return (c, x, y) => {
    const t = bayer(x, y) * spread
    return [0, 1, 2].map((k) => clamp(Math.round((c[k] + t) / step) * step))
  }
}
function posterMode(levels) {
  const step = 255 / (levels - 1)
  return (c) => {
    const l = grayscaleValue(c[0], c[1], c[2])
    const q = (v) => Math.round((l + (v - l) * 1.2) / step) * step // +20% saturation
    return [clamp(q(c[0])), clamp(q(c[1])), clamp(q(c[2]))]
  }
}

const PIXEL_MODES = {
  pixel: { cols: 72, map: posterMode(10) },
  candy: { cols: 64, map: rampMode(RAMPS.candy, 0.22) },
  gameboy: { cols: 60, map: rampMode(RAMPS.gameboy, 0.2) },
  arcade: { cols: 72, map: cubeMode(4, 44) },
  bitmap: { cols: 80, map: rampMode(RAMPS.bitmap, 0.5) },
}

function pixelate(imageData, mode, colsOverride) {
  const { width: w, height: h, data: d } = imageData
  const cols = Math.min(colsOverride || mode.cols, w)
  const cell = w / cols
  const rows = Math.max(1, Math.round(h / cell))
  const cw = w / cols, ch = h / rows
  const sum = new Float32Array(cols * rows * 3)
  const cnt = new Float32Array(cols * rows)
  const gx = new Uint16Array(w)
  for (let x = 0; x < w; x++) gx[x] = Math.min(cols - 1, Math.floor(x / cw))
  for (let y = 0; y < h; y++) {
    const row = Math.min(rows - 1, Math.floor(y / ch)) * cols
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4, c = row + gx[x]
      sum[c * 3] += d[i]; sum[c * 3 + 1] += d[i + 1]; sum[c * 3 + 2] += d[i + 2]; cnt[c]++
    }
  }
  const cells = new Array(cols * rows)
  const lums = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const k = r * cols + c, n = cnt[k] || 1
      const ci = (Math.min(h - 1, Math.floor((r + 0.5) * ch)) * w + Math.min(w - 1, Math.floor((c + 0.5) * cw))) * 4
      const px = [0, 1, 2].map((q) => 0.5 * (sum[k * 3 + q] / n) + 0.5 * d[ci + q]) // avg + centre = sharper
      cells[k] = px
      lums.push(grayscaleValue(px[0], px[1], px[2]))
    }
  }
  // gentle auto-contrast so flat/dim photos still pop
  lums.sort((a, b) => a - b)
  const lo = lums[Math.floor(lums.length * 0.02)], hi = lums[Math.floor(lums.length * 0.98)]
  const gain = hi - lo > 40 ? 255 / (hi - lo) : 1
  const out = new Array(cols * rows)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const px = cells[r * cols + c].map((v) => clamp((v - lo) * (1 + (gain - 1) * 0.7) + lo * 0.3))
      out[r * cols + c] = mode.map(px, c, r)
    }
  }
  for (let y = 0; y < h; y++) {
    const row = Math.min(rows - 1, Math.floor(y / ch)) * cols
    for (let x = 0; x < w; x++) {
      const col = out[row + gx[x]], i = (y * w + x) * 4
      d[i] = col[0]; d[i + 1] = col[1]; d[i + 2] = col[2]; d[i + 3] = 255
    }
  }
  return imageData
}

// opts.cols lets small thumbnails use a coarser grid than the full strip.
export function applyFilterToCanvas(ctx, width, height, filterId, opts = {}) {
  if (filterId === 'original') return
  const imageData = ctx.getImageData(0, 0, width, height)
  if (PIXEL_MODES[filterId]) {
    pixelate(imageData, PIXEL_MODES[filterId], opts.cols)
  } else {
    (filterFns[filterId] || filterFns.original)(imageData)
  }
  ctx.putImageData(imageData, 0, 0)
}

export function listFilterIds() {
  return [...Object.keys(PIXEL_MODES), ...Object.keys(filterFns)]
}
