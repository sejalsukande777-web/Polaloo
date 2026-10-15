import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useBoothState, useBoothDispatch } from '../context/BoothContext.jsx'
import { frameLibrary, buttonLibrary } from '../assets/assetLibrary.js'
import CameraView from './CameraView.jsx'
import Countdown from './Countdown.jsx'
import SourceSelect from './SourceSelect.jsx'
import PixelButton from './PixelButton.jsx'

const PAUSE_BETWEEN_SHOTS_MS = 1400

export default function PhotoBooth() {
  const state = useBoothState()
  const dispatch = useBoothDispatch()
  const cameraRef = useRef(null)
  // choosing -> camera-live -> counting -> between -> counting ... -> choosing
  const [mode, setMode] = useState('choosing')
  const [lastShot, setLastShot] = useState(null)

  const currentIndex = state.photos.findIndex((p) => p === null)
  const allCaptured = currentIndex === -1
  const remaining = state.photos.filter((p) => p === null).length
  const shotNumber = 4 - remaining + (allCaptured ? 0 : 1) // 1-based number of the photo being taken

  const slot = frameLibrary.fourStripSlots[Math.max(currentIndex, 0)]
  const aspect = useMemo(() => (slot ? (slot.w * 1200) / (slot.h * 3600) : 1), [slot])

  // After a shot: show it for a moment, then automatically count down for the next one.
  useEffect(() => {
    if (mode !== 'between') return
    const t = setTimeout(() => setMode('counting'), PAUSE_BETWEEN_SHOTS_MS)
    return () => clearTimeout(t)
  }, [mode])

  function handleCaptureNow() {
    const dataUrl = cameraRef.current?.capture()
    if (!dataUrl) {
      setMode('camera-live')
      return
    }
    dispatch({ type: 'SET_PHOTO', index: currentIndex, dataUrl })
    if (remaining > 1) {
      setLastShot(dataUrl)
      setMode('between')
    } else {
      setLastShot(null)
      setMode('choosing') // all four done — camera closes
    }
  }
  // Countdown calls this once; keep a stable reference so its timers never restart mid-count.
  const captureRef = useRef(handleCaptureNow)
  captureRef.current = handleCaptureNow
  const onCountdownDone = useCallback(() => captureRef.current(), [])

  function stopSequence() {
    setLastShot(null)
    setMode('choosing')
  }

  // Gallery: pick several photos at once; they fill the empty slots in order.
  function handleGalleryFiles(dataUrls) {
    const empty = state.photos.map((p, i) => (p === null ? i : -1)).filter((i) => i >= 0)
    dataUrls.slice(0, empty.length).forEach((dataUrl, k) => dispatch({ type: 'SET_PHOTO', index: empty[k], dataUrl }))
  }

  const cameraOn = mode === 'camera-live' || mode === 'counting' || mode === 'between'

  return (
    <div className="screen booth-screen">
      <div className="booth-top-bar">
        <PixelButton src={buttonLibrary.back} label="Back" variant="secondary" onClick={() => dispatch({ type: 'GO_TO', screen: 'home' })} />
        <div className="progress-dots">
          {state.photos.map((p, i) => (
            <span key={i} className={`dot ${p ? 'filled' : ''} ${i === currentIndex ? 'active' : ''}`} />
          ))}
        </div>
      </div>

      <div className="booth-frame">
        <div className="booth-photo-opening" style={{ aspectRatio: aspect }}>
          {cameraOn ? (
            <CameraView ref={cameraRef} aspect={aspect} />
          ) : state.photos[currentIndex] ? (
            <img src={state.photos[currentIndex]} alt={`Photo ${currentIndex + 1} preview`} className="captured-preview" />
          ) : (
            <div className="empty-slot">{allCaptured ? 'ALL DONE!' : `PHOTO ${currentIndex + 1}/4`}</div>
          )}
          {mode === 'between' && lastShot && <img src={lastShot} alt="Last photo" className="shot-preview" />}
          {cameraOn && !allCaptured && <div className="shot-badge">{mode === 'between' ? 'NICE! NEXT…' : `PHOTO ${shotNumber}/4`}</div>}
          {mode === 'counting' && <Countdown key={currentIndex} onComplete={onCountdownDone} />}
        </div>
      </div>

      {!allCaptured && mode === 'choosing' && (
        <>
          <SourceSelect onTakePhoto={() => setMode('camera-live')} onGalleryFiles={handleGalleryFiles} maxFiles={remaining} />
          <p className="booth-hint">
            {remaining === 4 ? 'Camera takes all 4 photos in a row.' : `Camera takes the last ${remaining} photo${remaining > 1 ? 's' : ''} in a row.`} Or pick up to {remaining} from your gallery at once.
          </p>
        </>
      )}

      {!allCaptured && mode === 'camera-live' && (
        <>
          <div className="booth-actions">
            <PixelButton src={buttonLibrary.capture} label={`Start — take ${remaining} photo${remaining > 1 ? 's' : ''}`} onClick={() => setMode('counting')} />
            <PixelButton label="Cancel" variant="secondary" onClick={stopSequence} />
          </div>
          <p className="booth-hint">Tap the button to start. We'll count down and snap {remaining === 1 ? 'your photo' : `all ${remaining} photos`} automatically.</p>
        </>
      )}

      {(mode === 'counting' || mode === 'between') && (
        <div className="booth-actions">
          <PixelButton label="Stop" variant="secondary" onClick={stopSequence} />
        </div>
      )}

      <div className="thumb-row">
        {state.photos.map((p, i) => (
          <div key={i} className="thumb-slot">
            {p ? (
              <>
                <img src={p} alt={`Captured ${i + 1}`} />
                <button
                  className={`retake-btn ${buttonLibrary.retake ? 'icon' : ''}`}
                  onClick={() => dispatch({ type: 'RETAKE_PHOTO', index: i })}
                  style={buttonLibrary.retake ? { backgroundImage: `url(${buttonLibrary.retake})` } : undefined}
                  aria-label="Retake"
                >
                  {!buttonLibrary.retake && 'Retake'}
                </button>
              </>
            ) : (
              <div className="thumb-empty">{i + 1}</div>
            )}
          </div>
        ))}
      </div>

      {allCaptured && <PixelButton label="Continue to Editor" onClick={() => dispatch({ type: 'GO_TO', screen: 'editor' })} />}
    </div>
  )
}
