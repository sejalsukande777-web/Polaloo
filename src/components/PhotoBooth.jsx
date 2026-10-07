import { useRef, useState, useMemo } from 'react'
import { useBoothState, useBoothDispatch } from '../context/BoothContext.jsx'
import { frameLibrary, buttonLibrary } from '../assets/assetLibrary.js'
import CameraView from './CameraView.jsx'
import Countdown from './Countdown.jsx'
import SourceSelect from './SourceSelect.jsx'
import PixelButton from './PixelButton.jsx'

export default function PhotoBooth() {
  const state = useBoothState()
  const dispatch = useBoothDispatch()
  const cameraRef = useRef(null)
  const [mode, setMode] = useState('choosing')

  const currentIndex = state.photos.findIndex((p) => p === null)
  const allCaptured = currentIndex === -1

  const slot = frameLibrary.fourStripSlots[Math.max(currentIndex, 0)]
  const aspect = useMemo(() => (slot ? (slot.w * 1200) / (slot.h * 3600) : 1), [slot])

  function handleTakePhoto() {
    setMode('camera-live')
  }

  function handleGalleryFile(dataUrl) {
    dispatch({ type: 'SET_PHOTO', index: currentIndex, dataUrl })
    setMode('choosing')
  }

  function startCountdown() {
    setMode('counting')
  }

  function handleCaptureNow() {
    const dataUrl = cameraRef.current?.capture()
    if (dataUrl) {
      dispatch({ type: 'SET_PHOTO', index: currentIndex, dataUrl })
    }
    setMode('choosing')
  }

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
          {mode === 'camera-live' || mode === 'counting' ? (
            <CameraView ref={cameraRef} aspect={aspect} />
          ) : state.photos[currentIndex] ? (
            <img src={state.photos[currentIndex]} alt={`Photo ${currentIndex + 1} preview`} className="captured-preview" />
          ) : (
            <div className="empty-slot">{allCaptured ? "ALL DONE!" : `PHOTO ${currentIndex + 1}/4`}</div>
          )}
          {mode === 'counting' && <Countdown onComplete={handleCaptureNow} />}
        </div>
      </div>

      {!allCaptured && mode === 'choosing' && (
        <SourceSelect onTakePhoto={handleTakePhoto} onGalleryFile={handleGalleryFile} />
      )}

      {!allCaptured && mode === 'camera-live' && (
        <div className="booth-actions">
          <PixelButton src={buttonLibrary.capture} label="Capture" onClick={startCountdown} />
          <PixelButton label="Cancel" variant="secondary" onClick={() => setMode('choosing')} />
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

      {allCaptured && (
        <PixelButton label="Continue to Editor" onClick={() => dispatch({ type: 'GO_TO', screen: 'editor' })} />
      )}
    </div>
  )
}
