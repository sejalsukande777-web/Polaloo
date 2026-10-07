export function computeCoverCrop(imgW, imgH, dstRatio, zoom = 1, panX = 0.5, panY = 0.5) {
  const srcRatio = imgW / imgH
  let baseW, baseH
  if (srcRatio > dstRatio) {
    baseH = imgH
    baseW = baseH * dstRatio
  } else {
    baseW = imgW
    baseH = baseW / dstRatio
  }

  const z = Math.max(1, zoom)
  const cropW = Math.min(imgW, baseW / z)
  const cropH = Math.min(imgH, baseH / z)

  const maxX = Math.max(0, imgW - cropW)
  const maxY = Math.max(0, imgH - cropH)

  const sx = maxX * Math.min(1, Math.max(0, panX))
  const sy = maxY * Math.min(1, Math.max(0, panY))

  return { sx, sy, sw: cropW, sh: cropH }
}

export const DEFAULT_CROP = { zoom: 1, panX: 0.5, panY: 0.5 }
