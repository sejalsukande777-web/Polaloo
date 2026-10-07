import { useBoothDispatch } from '../context/BoothContext.jsx'
import { buttonLibrary } from '../assets/assetLibrary.js'
import PixelButton from './PixelButton.jsx'

export default function Settings() {
  const dispatch = useBoothDispatch()

  return (
    <div className="screen settings-screen">
      <div className="editor-top-bar">
        <PixelButton src={buttonLibrary.back} label="Back" variant="secondary" onClick={() => dispatch({ type: 'GO_TO', screen: 'home' })} />
        <h2>Settings</h2>
      </div>
      <div className="control-deck">
      <p className="empty-note">
        Nothing to tweak yet! If you want a fresh start, wipe this session below.
      </p>
      <PixelButton src={buttonLibrary.reset} label="Reset Current Booth Session" variant="secondary" onClick={() => dispatch({ type: 'RESET_BOOTH' })} />
      </div>
    </div>
  )
}
