import { useRef, useState } from 'react'
import { useBoothState, useBoothDispatch } from '../context/BoothContext.jsx'

export default function StickerCanvas({ containerRef }) {
  const state = useBoothState()
  const dispatch = useBoothDispatch()
  const [activeId, setActiveId] = useState(null)
  const dragInfo = useRef(null)

  function getRect() {
    return containerRef.current?.getBoundingClientRect()
  }

  function updateSticker(id, patch) {
    dispatch({ type: 'UPDATE_STICKER', id, patch })
  }

  function onStickerPointerDown(e, sticker) {
    e.stopPropagation()
    e.target.setPointerCapture(e.pointerId)
    setActiveId(sticker.id)
    const rect = getRect()
    dragInfo.current = {
      mode: 'move',
      startX: e.clientX,
      startY: e.clientY,
      origX: sticker.x,
      origY: sticker.y,
      rectW: rect.width,
      rectH: rect.height,
    }
  }

  function onHandlePointerDown(e, sticker, mode) {
    e.stopPropagation()
    e.target.setPointerCapture(e.pointerId)
    setActiveId(sticker.id)
    const rect = getRect()
    dragInfo.current = {
      mode,
      startX: e.clientX,
      startY: e.clientY,
      origSize: sticker.size,
      origRotation: sticker.rotation,
      centerX: rect.left + sticker.x * rect.width,
      centerY: rect.top + sticker.y * rect.height,
      rectW: rect.width,
      rectH: rect.height,
    }
  }

  function onPointerMove(e) {
    const info = dragInfo.current
    if (!info || !activeId) return

    if (info.mode === 'move') {
      const dx = (e.clientX - info.startX) / info.rectW
      const dy = (e.clientY - info.startY) / info.rectH
      updateSticker(activeId, {
        x: Math.min(1, Math.max(0, info.origX + dx)),
        y: Math.min(1, Math.max(0, info.origY + dy)),
      })
    } else if (info.mode === 'resize') {
      const dxPx = e.clientX - info.centerX
      const dyPx = e.clientY - info.centerY
      const distPx = Math.sqrt(dxPx * dxPx + dyPx * dyPx) * 2
      const size = Math.min(0.8, Math.max(0.04, distPx / info.rectW))
      updateSticker(activeId, { size })
    } else if (info.mode === 'rotate') {
      const angle = (Math.atan2(e.clientY - info.centerY, e.clientX - info.centerX) * 180) / Math.PI
      updateSticker(activeId, { rotation: angle + 90 })
    }
  }

  function onPointerUp() {
    dragInfo.current = null
  }

  return (
    <div
      className="sticker-canvas"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={(e) => {
        if (e.target === e.currentTarget) setActiveId(null)
      }}
    >
      {state.stickers.map((s) => (
        <div
          key={s.id}
          className={`sticker-instance ${activeId === s.id ? 'active' : ''}`}
          style={{
            left: `${s.x * 100}%`,
            top: `${s.y * 100}%`,
            width: `${s.size * 100}%`,
            transform: `translate(-50%, -50%) rotate(${s.rotation}deg)`,
          }}
          onPointerDown={(e) => onStickerPointerDown(e, s)}
        >
          <img src={s.src} alt="sticker" draggable={false} />
          {activeId === s.id && (
            <>
              <button
                className="sticker-delete"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation()
                  dispatch({ type: 'REMOVE_STICKER', id: s.id })
                  setActiveId(null)
                }}
              >
                ×
              </button>
              <div className="sticker-handle resize" onPointerDown={(e) => onHandlePointerDown(e, s, 'resize')} />
              <div className="sticker-handle rotate" onPointerDown={(e) => onHandlePointerDown(e, s, 'rotate')} />
            </>
          )}
        </div>
      ))}
    </div>
  )
}
