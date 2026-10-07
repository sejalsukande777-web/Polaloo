import { backgroundOptions, cssBackgroundStyle } from '../utils/stripBackgrounds.js'
import { useBoothState, useBoothDispatch } from '../context/BoothContext.jsx'

export default function BackgroundPanel() {
  const state = useBoothState()
  const dispatch = useBoothDispatch()

  return (
    <div className="background-panel">
      <h3>Strip Background</h3>
      <div className="background-swatch-row">
        {backgroundOptions.map((opt) => (
          <button
            key={opt.id}
            className={`background-swatch ${state.stripBackground === opt.id ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_STRIP_BACKGROUND', id: opt.id })}
          >
            <span className="background-swatch-preview" style={cssBackgroundStyle(opt, { square: true, zoom: 2.5 })} />
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
