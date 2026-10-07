import { useEffect, useRef, useState } from 'react'
import { frameLibrary } from '../assets/assetLibrary.js'
import { computeCoverCrop, DEFAULT_CROP } from '../utils/photoCrop.js'
import { useBoothState, useBoothDispatch } from '../context/BoothContext.jsx'
import PixelButton from './PixelButton.jsx'

const MIN_ZOOM = 1
const MAX_ZOOM = 3
const ZOOM_STEP = 0.25

function AdjustCanvas({ src, crop, slot, onPan, onZoom }) {
  const canvasRef = useRef(null)
  const imgRef = useRef(null)
  const dragInfo = useRef(null)
  const pointers = useRef(new Map())
  const pinchInfo = useRef(null)
  const aspect = slot.w / slot.h

  function redraw() {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img || !img.complete) return
    const dpr = window.devicePixelRatio || 1
    const cssW = canvas.clientWidth || 300
    const cssH = canvas.clientHeight || 300
    canvas.width = cssW * dpr
    canvas.height = cssH * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    const { sx, sy, sw, sh } = computeCoverCrop(img.width, img.height, cssW / cssH, crop.zoom, crop.panX, crop.panY)
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cssW, cssH)
  }

  useEffect(() => {
    if (!src) return
    const img = new Image()
    img.onload = () => {
      imgRef.current = img
      redraw()
    }
    img.src = src
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  useEffect(() => {
    redraw()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crop.zoom, crop.panX, crop.panY])

  function dist(p1, p2) {
    const dx = p1.x - p2.x
    const dy = p1.y - p2.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  function onPointerDown(e) {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return
    canvas.setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (pointers.current.size === 2) {
      // Second finger down — switch to pinch-zoom, cancel any single-finger pan.
      const pts = Array.from(pointers.current.values())
      pinchInfo.current = { startDist: dist(pts[0], pts[1]), startZoom: crop.zoom }
      dragInfo.current = null
    } else if (pointers.current.size === 1) {
      const cssW = canvas.clientWidth
      const cssH = canvas.clientHeight
      const { sx, sy, sw, sh } = computeCoverCrop(img.width, img.height, cssW / cssH, crop.zoom, crop.panX, crop.panY)
      const maxX = Math.max(0, img.width - sw)
      const maxY = Math.max(0, img.height - sh)
      dragInfo.current = { startX: e.clientX, startY: e.clientY, sx0: sx, sy0: sy, sw, sh, maxX, maxY, cssW, cssH }
    }
  }

  function onPointerMove(e) {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (pointers.current.size === 2 && pinchInfo.current) {
      const pts = Array.from(pointers.current.values())
      const scale = dist(pts[0], pts[1]) / pinchInfo.current.startDist
      onZoom(pinchInfo.current.startZoom * scale)
      return
    }

    const info = dragInfo.current
    if (!info) return
    const dxFrac = (e.clientX - info.startX) / info.cssW
    const dyFrac = (e.clientY - info.startY) / info.cssH
    const newSx = info.sx0 - dxFrac * info.sw
    const newSy = info.sy0 - dyFrac * info.sh
    const panX = info.maxX > 0 ? Math.min(1, Math.max(0, newSx / info.maxX)) : 0.5
    const panY = info.maxY > 0 ? Math.min(1, Math.max(0, newSy / info.maxY)) : 0.5
    onPan({ panX, panY })
  }

  function onPointerUp(e) {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) pinchInfo.current = null
    if (pointers.current.size === 0) dragInfo.current = null
  }

  return (
    <div className="adjust-canvas-wrap" style={{ aspectRatio: aspect }}>
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />
    </div>
  )
}

export default function PhotoAdjustPanel() {
  const state = useBoothState()
  const dispatch = useBoothDispatch()
  const [activeIndex, setActiveIndex] = useState(state.photos.findIndex(Boolean) === -1 ? 0 : state.photos.findIndex(Boolean))

  const crop = state.photoCrops?.[activeIndex] || DEFAULT_CROP
  const slot = frameLibrary.fourStripSlots[activeIndex]
  const src = state.photos[activeIndex]

  function patchCrop(patch) {
    dispatch({ type: 'SET_PHOTO_CROP', index: activeIndex, patch })
  }

  function setZoom(nextZoom) {
    patchCrop({ zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom)) })
  }

  return (
    <div className="adjust-panel">
      <h3>Adjust Photo</h3>
      <div className="photo-index-picker">
        {state.photos.map((p, i) => (
          <button key={i} className={activeIndex === i ? 'active' : ''} disabled={!p} onClick={() => setActiveIndex(i)}>
            Photo {i + 1}
          </button>
        ))}
      </div>

      {!src ? (
        <p className="empty-note">This slot doesn't have a photo yet.</p>
      ) : (
        <>
          <p className="empty-note">Drag to reposition. Pinch with two fingers, or use the slider, to zoom.</p>
          <AdjustCanvas src={src} crop={crop} slot={slot} onPan={(patch) => patchCrop(patch)} onZoom={setZoom} />
          <div className="zoom-controls">
            <button onClick={() => setZoom(crop.zoom - ZOOM_STEP)} aria-label="Zoom out">−</button>
            <input
              type="range"
              className="zoom-slider"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={0.01}
              value={crop.zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              aria-label="Zoom level"
            />
            <button onClick={() => setZoom(crop.zoom + ZOOM_STEP)} aria-label="Zoom in">+</button>
          </div>
          <div className="zoom-percent">{Math.round(crop.zoom * 100)}%</div>
          <PixelButton label="Reset This Photo" variant="secondary" onClick={() => patchCrop({ ...DEFAULT_CROP })} />
        </>
      )}
    </div>
  )
}
