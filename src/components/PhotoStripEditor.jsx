import { useRef, useState } from 'react'
import { useBoothState, useBoothDispatch } from '../context/BoothContext.jsx'
import { buttonLibrary } from '../assets/assetLibrary.js'
import PhotoPreview from './PhotoPreview.jsx'
import PhotoAdjustPanel from './PhotoAdjustPanel.jsx'
import FilterPanel from './FilterPanel.jsx'
import StickerPanel from './StickerPanel.jsx'
import BackgroundPanel from './BackgroundPanel.jsx'
import ExportPanel from './ExportPanel.jsx'
import PixelButton from './PixelButton.jsx'

export default function PhotoStripEditor() {
  const state = useBoothState()
  const dispatch = useBoothDispatch()
  const previewRef = useRef(null)
  const [activeTab, setActiveTab] = useState('adjust')
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const [zoom, setZoom] = useState(1)

  const clampZoom = (z) => Math.min(2.5, Math.max(0.5, z))

  return (
    <div className="screen editor-screen">
      <div className="editor-top-bar">
        <PixelButton src={buttonLibrary.back} label="Back" variant="secondary" onClick={() => dispatch({ type: 'GO_TO', screen: 'booth' })} />
        <PixelButton src={buttonLibrary.reset} label="Reset Edits" variant="secondary" onClick={() => dispatch({ type: 'RESET_EDITS' })} />
      </div>

      <div className="zoom-controls">
        <button onClick={() => setZoom((z) => clampZoom(z - 0.25))} aria-label="Zoom out">−</button>
        <button onClick={() => setZoom(1)} aria-label="Reset zoom">{Math.round(zoom * 100)}%</button>
        <button onClick={() => setZoom((z) => clampZoom(z + 0.25))} aria-label="Zoom in">+</button>
      </div>

      <div className="photo-preview-viewport">
        <div className="photo-preview-scaler" style={{ transform: `scale(${zoom})` }}>
          <PhotoPreview ref={previewRef} photos={state.photos} filters={state.photoFilters} showDate={state.showDate} />
        </div>
      </div>

      <div className="editor-tabs">
        <button className={activeTab === 'adjust' ? 'active' : ''} onClick={() => setActiveTab('adjust')}>Crop</button>
        <button className={activeTab === 'filters' ? 'active' : ''} onClick={() => setActiveTab('filters')}>Filter</button>
        <button className={activeTab === 'stickers' ? 'active' : ''} onClick={() => setActiveTab('stickers')}>Sticker</button>
        <button className={activeTab === 'background' ? 'active' : ''} onClick={() => setActiveTab('background')}>BG</button>
        <button className={activeTab === 'export' ? 'active' : ''} onClick={() => setActiveTab('export')}>Save</button>
      </div>

      <div className="control-deck">
      {activeTab === 'adjust' && <PhotoAdjustPanel />}

      {activeTab === 'filters' && (
        <>
          <div className="photo-index-picker">
            {state.photos.map((_, i) => (
              <button key={i} className={activePhotoIndex === i ? 'active' : ''} onClick={() => setActivePhotoIndex(i)}>
                Photo {i + 1}
              </button>
            ))}
          </div>
          <FilterPanel activePhotoIndex={activePhotoIndex} />
        </>
      )}

      {activeTab === 'stickers' && <StickerPanel />}
      {activeTab === 'background' && <BackgroundPanel />}
      {activeTab === 'export' && <ExportPanel />}
      </div>
    </div>
  )
}
