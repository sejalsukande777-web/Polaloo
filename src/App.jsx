import { useEffect } from 'react'
import { BoothProvider, useBoothState } from './context/BoothContext.jsx'
import HomeScreen from './components/HomeScreen.jsx'
import PhotoBooth from './components/PhotoBooth.jsx'
import PhotoStripEditor from './components/PhotoStripEditor.jsx'
import Gallery from './components/Gallery.jsx'
import Settings from './components/Settings.jsx'
import './styles.css'

function Router() {
  const state = useBoothState()
  switch (state.screen) {
    case 'booth':
      return <PhotoBooth />
    case 'editor':
      return <PhotoStripEditor />
    case 'gallerySavedList':
      return <Gallery />
    case 'settings':
      return <Settings />
    default:
      return <HomeScreen />
  }
}

// Pixel-perfect scaling: every pixel of the 108-wide world art becomes a whole number of screen pixels,
// so the pixels are all the same size (fractional scaling made them uneven and glitchy-looking on phones).
function useArtScale() {
  useEffect(() => {
    const set = () => {
      const dpr = window.devicePixelRatio || 1
      const n = Math.ceil((Math.min(window.innerWidth, 520) * dpr) / 108)
      document.documentElement.style.setProperty('--art', `${n / dpr}px`)
    }
    set()
    window.addEventListener('resize', set)
    return () => window.removeEventListener('resize', set)
  }, [])
}

export default function App() {
  useArtScale()
  return (
    <BoothProvider>
      <div className="world-layer" />
      <div className="app-root">
        <Router />
      </div>
    </BoothProvider>
  )
}
