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

export default function App() {
  return (
    <BoothProvider>
      <div className="world-layer" />
      <div className="app-root">
        <Router />
      </div>
    </BoothProvider>
  )
}
