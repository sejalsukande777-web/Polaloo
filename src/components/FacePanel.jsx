import { useState } from 'react'
import { useBoothState, useBoothDispatch } from '../context/BoothContext.jsx'
import { getSticker, frameLibrary } from '../assets/assetLibrary.js'
import { FACE_ACCESSORIES, detectFaces, faceStickers } from '../utils/faceFit.js'
import { DEFAULT_CROP } from '../utils/photoCrop.js'

let faceCounter = 0

export default function FacePanel() {
  const state = useBoothState()
  const dispatch = useBoothDispatch()
  const [target, setTarget] = useState('all')
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  const hasFaceStickers = state.stickers.some((s) => s.faceFit)

  async function apply(acc) {
    if (busy) return
    const indexes = (target === 'all' ? [0, 1, 2, 3] : [target]).filter((i) => state.photos[i])
    if (!indexes.length) return setStatus('Take or choose a photo first.')
    setBusy(true)
    setStatus('Finding faces… (the first time this downloads about 10 MB)')
    try {
      let added = 0
      const missed = []
      for (const i of indexes) {
        const { faces, w, h } = await detectFaces(state.photos[i])
        const slot = frameLibrary.fourStripSlots[i]
        const crop = state.photoCrops?.[i] || DEFAULT_CROP
        const found = faceStickers({ faces, w, h, acc, slot, crop })
        if (!found.length) missed.push(i + 1)
        found.forEach((f) => {
          dispatch({
            type: 'ADD_STICKER',
            sticker: { id: `face-${Date.now()}-${faceCounter++}`, src: getSticker(acc.id), categoryId: 'face', faceFit: true, photoIndex: i, ...f },
          })
          added++
        })
      }
      if (!added) setStatus('No face found. Try a clear, front-facing photo with good light.')
      else setStatus(`Added to ${added} face${added > 1 ? 's' : ''}. Drag or resize it in the Sticker tab if needed.` + (missed.length ? ` No face found in photo ${missed.join(', ')}.` : ''))
    } catch (e) {
      setStatus("Couldn't load the face finder. Check your connection and try again.")
    }
    setBusy(false)
  }

  function clearAll() {
    state.stickers.filter((s) => s.faceFit).forEach((s) => dispatch({ type: 'REMOVE_STICKER', id: s.id }))
    setStatus('Face accessories removed.')
  }

  return (
    <div className="face-panel">
      <h3>Face Accessories</h3>
      <p className="empty-note">Pick a photo, then tap an accessory. It finds the face and puts it on automatically.</p>
      <div className="photo-index-picker">
        <button className={target === 'all' ? 'active' : ''} onClick={() => setTarget('all')}>All photos</button>
        {[0, 1, 2, 3].map((i) => (
          <button key={i} className={target === i ? 'active' : ''} disabled={!state.photos[i]} onClick={() => setTarget(i)}>Photo {i + 1}</button>
        ))}
      </div>
      <div className="sticker-grid">
        {FACE_ACCESSORIES.map((acc) => (
          <button key={acc.id} className="sticker-thumb" disabled={busy} onClick={() => apply(acc)} title={acc.label}>
            <img src={getSticker(acc.id)} alt={acc.label} draggable="false" />
          </button>
        ))}
      </div>
      {status && <p className="face-status">{status}</p>}
      {hasFaceStickers && <button className="face-clear" onClick={clearAll}>Remove face accessories</button>}
    </div>
  )
}
