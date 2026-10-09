import { forwardRef, useEffect, useRef } from 'react'
import { frameLibrary } from '../assets/assetLibrary.js'
import { applyFilterToCanvas } from '../utils/filters.js'
import { isMissing } from '../utils/placeholder.js'
import { getBackgroundOption, cssBackgroundStyle } from '../utils/stripBackgrounds.js'
import { computeCoverCrop, DEFAULT_CROP } from '../utils/photoCrop.js'
import { useBoothState } from '../context/BoothContext.jsx'
import StickerCanvas from './StickerCanvas.jsx'

function PhotoSlotCanvas({ src, filterId, slot, crop }) {
  const canvasRef = useRef(null)
  const { pixelSize } = useBoothState()

  useEffect(() => {
    if (!src) return
    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const dpr = window.devicePixelRatio || 1
      const cssW = canvas.clientWidth || 300
      const cssH = canvas.clientHeight || 150
      canvas.width = cssW * dpr
      canvas.height = cssH * dpr
      const ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)

      const dstRatio = cssW / cssH
      const { sx, sy, sw, sh } = computeCoverCrop(img.width, img.height, dstRatio, crop?.zoom, crop?.panX, crop?.panY)
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cssW, cssH)
      applyFilterToCanvas(ctx, canvas.width, canvas.height, filterId, { size: pixelSize })
    }
    img.src = src
  }, [src, filterId, pixelSize, crop?.zoom, crop?.panX, crop?.panY])

  return (
    <div
      className="preview-slot"
      style={{ left: `${slot.x * 100}%`, top: `${slot.y * 100}%`, width: `${slot.w * 100}%`, height: `${slot.h * 100}%` }}
    >
      {src ? <canvas ref={canvasRef} /> : <div className="preview-slot-empty" />}
    </div>
  )
}

const PhotoPreview = forwardRef(function PhotoPreview({ photos, filters, showDate }, ref) {
  const state = useBoothState()
  const frameMissing = isMissing(frameLibrary.fourStrip)
  const bgOption = getBackgroundOption(state.stripBackground)

  return (
    <div ref={ref} className="photo-preview">
      <div
        className="photo-preview-inner"
        style={{
          ...(bgOption.shaped ? { backgroundColor: '#fffdf8' } : frameMissing ? cssBackgroundStyle(bgOption) : { backgroundImage: `url(${frameLibrary.fourStrip})` }),
        }}
      >
        {frameLibrary.fourStripSlots.map((slot, i) => (
          <PhotoSlotCanvas key={i} src={photos[i]} filterId={filters[i]} slot={slot} crop={state.photoCrops?.[i] || DEFAULT_CROP} />
        ))}
        {bgOption.shaped && <div className="frame-overlay" style={cssBackgroundStyle(bgOption)} />}
        {showDate && <div className="preview-date" style={{ color: bgOption.dark ? '#fff6e9' : '#2b1d4a', textAlign: bgOption.dateAlign || 'center', padding: '0 10%' }}>{new Date().toLocaleDateString()}</div>}
      </div>
      <StickerCanvas containerRef={ref} />
    </div>
  )
})

export default PhotoPreview
