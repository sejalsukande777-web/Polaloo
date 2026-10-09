import { applyFilterToCanvas } from './filters.js'
import { frameLibrary } from '../assets/assetLibrary.js'
import { getBackgroundOption, drawBackgroundOnCanvas } from './stripBackgrounds.js'
import { computeCoverCrop, DEFAULT_CROP } from './photoCrop.js'

import { EXPORT_WIDTH, EXPORT_HEIGHT } from './exportDims.js'
export { EXPORT_WIDTH, EXPORT_HEIGHT }

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export async function composePhotoStrip({
  photos,
  filters,
  stickers = [],
  showDate = false,
  pixelSize = 'medium',
  backgroundId = 'cream',
  photoCrops = [],
}) {
  const canvas = document.createElement('canvas')
  canvas.width = EXPORT_WIDTH
  canvas.height = EXPORT_HEIGHT
  const ctx = canvas.getContext('2d')

  const background = getBackgroundOption(backgroundId)
  if (!background.shaped) drawBackgroundOnCanvas(ctx, canvas.width, canvas.height, background)

  const slots = frameLibrary.fourStripSlots

  for (let i = 0; i < 4; i++) {
    if (!photos[i]) continue
    const img = await loadImage(photos[i])
    const slot = slots[i]
    const dx = slot.x * canvas.width
    const dy = slot.y * canvas.height
    const dw = slot.w * canvas.width
    const dh = slot.h * canvas.height

    const off = document.createElement('canvas')
    off.width = dw
    off.height = dh
    const offCtx = off.getContext('2d')
    const crop = photoCrops[i] || DEFAULT_CROP
    const { sx, sy, sw, sh } = computeCoverCrop(img.width, img.height, dw / dh, crop.zoom, crop.panX, crop.panY)
    offCtx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh)
    applyFilterToCanvas(offCtx, dw, dh, filters?.[i] || 'original', { size: pixelSize })

    ctx.drawImage(off, dx, dy)
  }

  if (background.shaped) drawBackgroundOnCanvas(ctx, canvas.width, canvas.height, background)

  if (frameLibrary.fourStrip) {
    const frameImg = await loadImage(frameLibrary.fourStrip)
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height)
  }

  for (const sticker of stickers) {
    if (!sticker.src) continue
    const img = await loadImage(sticker.src)
    ctx.save()
    const cx = sticker.x * canvas.width
    const cy = sticker.y * canvas.height
    const size = sticker.size * canvas.width
    ctx.translate(cx, cy)
    ctx.rotate(((sticker.rotation || 0) * Math.PI) / 180)
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(img, -size / 2, -size / 2, size, size)
    ctx.restore()
  }

  if (showDate) {
    await document.fonts.load('20px "Pixelify Sans"')
    ctx.fillStyle = background.dark ? '#fff6e9' : '#2b1d4a'
    ctx.font = `${Math.round(canvas.width * 0.04)}px "Pixelify Sans", monospace`
    const al = background.dateAlign || 'center'
    ctx.textAlign = al
    const dateStr = new Date().toLocaleDateString()
    ctx.fillText(dateStr, al === 'left' ? canvas.width * 0.1 : al === 'right' ? canvas.width * 0.9 : canvas.width / 2, canvas.height - canvas.height * 0.035)
  }

  return canvas
}

export function canvasToDownload(canvas, filename, type = 'image/png') {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 5000)
      resolve()
    }, type, 0.95)
  })
}
