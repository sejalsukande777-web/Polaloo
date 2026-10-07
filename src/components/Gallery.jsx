import { useBoothState, useBoothDispatch } from '../context/BoothContext.jsx'
import { buttonLibrary } from '../assets/assetLibrary.js'
import PixelButton from './PixelButton.jsx'

export default function Gallery() {
  const state = useBoothState()
  const dispatch = useBoothDispatch()

  return (
    <div className="screen gallery-screen">
      <div className="editor-top-bar">
        <PixelButton src={buttonLibrary.back} label="Back" variant="secondary" onClick={() => dispatch({ type: 'GO_TO', screen: 'home' })} />
        <h2>Gallery</h2>
      </div>
      <div className="control-deck">
      {state.savedStrips.length === 0 ? (
        <p className="empty-note">No saved photo strips yet. Finish a booth session and download one to see it here.</p>
      ) : (
        <div className="gallery-grid">
          {state.savedStrips.map((src, i) => (
            <img key={i} src={src} alt={`Saved strip ${i + 1}`} className="gallery-thumb" />
          ))}
        </div>
      )}
      </div>
    </div>
  )
}
