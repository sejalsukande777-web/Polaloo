import { useEffect, useRef, useState } from 'react'
import { filterLibrary } from '../assets/assetLibrary.js'
import { applyFilterToCanvas } from '../utils/filters.js'
import { useBoothState, useBoothDispatch } from '../context/BoothContext.jsx'

function FilterSwatch({ photoSrc, filterId, label, active, onClick }) {
  const canvasRef = useRef(null)
  const { pixelSize } = useBoothState()

  useEffect(() => {
    if (!photoSrc) return
    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const size = 72
      const dpr = window.devicePixelRatio || 1
      canvas.width = size * dpr
      canvas.height = size * dpr
      const ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)

      const srcRatio = img.width / img.height
      let sx, sy, sw, sh
      if (srcRatio > 1) {
        sh = img.height
        sw = sh
        sx = (img.width - sw) / 2
        sy = 0
      } else {
        sw = img.width
        sh = sw
        sx = 0
        sy = (img.height - sh) / 2
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, size, size)
      applyFilterToCanvas(ctx, canvas.width, canvas.height, filterId, { cols: 44, size: pixelSize })
    }
    img.src = photoSrc
  }, [photoSrc, filterId, pixelSize])

  return (
    <button className={`filter-swatch ${active ? 'active' : ''}`} onClick={onClick}>
      <canvas ref={canvasRef} />
      <span>{label}</span>
    </button>
  )
}

export default function FilterPanel({ activePhotoIndex }) {
  const state = useBoothState()
  const dispatch = useBoothDispatch()
  const [applyToAll, setApplyToAll] = useState(true)
  const previewSrc = state.photos[activePhotoIndex] || state.photos.find(Boolean)

  function pick(filterId) {
    if (applyToAll) {
      dispatch({ type: 'SET_FILTER_ALL', filterId })
    } else {
      dispatch({ type: 'SET_FILTER_FOR_PHOTO', index: activePhotoIndex, filterId })
    }
  }

  const currentFilter = state.photoFilters[activePhotoIndex] || 'original'
  const mismatched = state.photoFilters.some((f) => f !== state.photoFilters[0])

  return (
    <div className="filter-panel">
      <div className="filter-panel-header">
        <h3>Filters</h3>
        <label className="apply-all-toggle">
          <input type="checkbox" checked={applyToAll} onChange={(e) => setApplyToAll(e.target.checked)} />
          Apply to all 4
        </label>
      </div>
      {mismatched && (
        <button
          className="sync-all-banner"
          onClick={() => dispatch({ type: 'SET_FILTER_ALL', filterId: currentFilter })}
        >
          Your 4 photos have different filters right now — tap to match them all to "
          {filterLibrary.find((f) => f.id === currentFilter)?.label || currentFilter}"
        </button>
      )}
      {[['classic', 'Classic'], ['pixel', 'Pixel']].map(([group, title]) => (
        <div key={group}>
          <div className="filter-group-title">{title}</div>
          {group === 'pixel' && (
            <div className="pixel-size-row">
              <span>Pixel size</span>
              {[['fine', 'Fine'], ['medium', 'Medium'], ['chunky', 'Chunky']].map(([id, label]) => (
                <button key={id} className={state.pixelSize === id ? 'active' : ''} onClick={() => dispatch({ type: 'SET_PIXEL_SIZE', size: id })}>{label}</button>
              ))}
            </div>
          )}
          <div className="filter-swatch-row">
            {filterLibrary.filter((f) => f.group === group).map((f) => (
              <FilterSwatch
                key={f.id}
                photoSrc={previewSrc}
                filterId={f.id}
                label={f.label}
                active={currentFilter === f.id}
                onClick={() => pick(f.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
