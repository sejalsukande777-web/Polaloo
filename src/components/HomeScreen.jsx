import { useEffect, useRef, useState } from 'react'
import { useBoothDispatch } from '../context/BoothContext.jsx'
import { doorLibrary, getSticker } from '../assets/assetLibrary.js'
import PixelButton from './PixelButton.jsx'

const TITLE = ['PIXEL PHOTO', 'BOOTH']
// Scenery placed in "world" coordinates (% of the stage, same box as the background art)
const SCENERY = [
  ['star-gold', 'top: 9%; left: 12%; width: 8%', 'twinkle'], ['sparkle-burst', 'top: 24%; right: 9%; width: 9%', 'twinkle d2'],
  ['heart-red', 'top: 41%; left: 6%; width: 8%', 'bob'],
  ['cat', 'bottom: 7%; left: 5%; width: 13%', 'hop'], ['bunny', 'bottom: 11%; left: 21%; width: 13%', 'hop d2'],
  ['chick', 'bottom: 11%; right: 21%; width: 13%', 'hop d3'], ['frog', 'bottom: 7%; right: 5%; width: 13%', 'hop d4'],
]
const css = (str) => Object.fromEntries(str.split(';').filter(Boolean).map((p) => p.split(':').map((x) => x.trim())))

export default function HomeScreen() {
  const dispatch = useBoothDispatch()
  const [step, setStep] = useState('idle') // idle -> ajar -> open -> welcome -> (booth)
  const timers = useRef([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  function openDoor() {
    if (step !== 'idle') return
    setStep('ajar')
    timers.current = [
      setTimeout(() => setStep('open'), 300),
      setTimeout(() => setStep('welcome'), 700),
      setTimeout(() => dispatch({ type: 'GO_TO', screen: 'booth' }), 2800),
    ]
  }
  const frame = step === 'idle' ? 0 : step === 'ajar' ? 1 : 2

  return (
    <div className="screen home-screen">
      <h1 className="title" aria-label="Pixel Photo Booth">
        {TITLE.map((word, r) => (
          <span className="title-row" key={word} aria-hidden="true">
            {[...word].map((ch, i) => (
              <span key={i} className={`ch c${(i + r * 2) % 5}`} style={{ animationDelay: `${(i + r * 5) * 90}ms` }}>{ch === ' ' ? '\u00a0' : ch}</span>
            ))}
          </span>
        ))}
      </h1>

      <div className="stage">
        {SCENERY.map(([id, pos, anim], i) => (
          <img key={i} src={getSticker(id)} alt="" draggable="false" className={`sprite ${anim}`} style={css(pos)} />
        ))}
        <div className={`door-glow ${step === 'idle' ? '' : 'on'}`} />
        <button className={`door-btn ${step}`} onClick={openDoor} aria-label="Open the door to start">
          <img src={doorLibrary[frame]} alt="" draggable="false" />
        </button>
        {step === 'idle' && <p className="knock">knock knock… tap the door!</p>}
      </div>

      {step === 'idle' && (
        <div className="home-secondary">
          <PixelButton label="Gallery" variant="mint" onClick={() => dispatch({ type: 'GO_TO', screen: 'gallerySavedList' })} />
          <PixelButton label="Settings" variant="sky" onClick={() => dispatch({ type: 'GO_TO', screen: 'settings' })} />
        </div>
      )}

      {step === 'welcome' && (
        <div className="welcome">
          <p className="welcome-small">WELCOME TO THE</p>
          <p className="welcome-big">POLAROID<br />WORLD</p>
          <p className="welcome-sub">step inside…</p>
        </div>
      )}
    </div>
  )
}
