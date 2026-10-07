import { createContext, useContext, useReducer } from 'react'
import { DEFAULT_CROP } from '../utils/photoCrop.js'

const initialState = {
  screen: 'home',
  photos: [null, null, null, null],
  photoFilters: ['original', 'original', 'original', 'original'],
  photoCrops: [{ ...DEFAULT_CROP }, { ...DEFAULT_CROP }, { ...DEFAULT_CROP }, { ...DEFAULT_CROP }],
  stickers: [],
  showDate: false,
  stripBackground: 'gingham',
  savedStrips: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'GO_TO':
      return { ...state, screen: action.screen }
    case 'SET_PHOTO': {
      const photos = [...state.photos]
      photos[action.index] = action.dataUrl
      const photoCrops = [...state.photoCrops]
      photoCrops[action.index] = { ...DEFAULT_CROP }
      return { ...state, photos, photoCrops }
    }
    case 'RETAKE_PHOTO': {
      const photos = [...state.photos]
      photos[action.index] = null
      const photoCrops = [...state.photoCrops]
      photoCrops[action.index] = { ...DEFAULT_CROP }
      return { ...state, photos, photoCrops }
    }
    case 'SET_PHOTO_CROP': {
      const photoCrops = [...state.photoCrops]
      photoCrops[action.index] = { ...photoCrops[action.index], ...action.patch }
      return { ...state, photoCrops }
    }
    case 'SET_FILTER_FOR_PHOTO': {
      const photoFilters = [...state.photoFilters]
      photoFilters[action.index] = action.filterId
      return { ...state, photoFilters }
    }
    case 'SET_FILTER_ALL':
      return { ...state, photoFilters: state.photoFilters.map(() => action.filterId) }
    case 'ADD_STICKER':
      return { ...state, stickers: [...state.stickers, action.sticker] }
    case 'UPDATE_STICKER':
      return {
        ...state,
        stickers: state.stickers.map((s) => (s.id === action.id ? { ...s, ...action.patch } : s)),
      }
    case 'REMOVE_STICKER':
      return { ...state, stickers: state.stickers.filter((s) => s.id !== action.id) }
    case 'TOGGLE_DATE':
      return { ...state, showDate: !state.showDate }
    case 'SET_STRIP_BACKGROUND':
      return { ...state, stripBackground: action.id }
    case 'RESET_EDITS':
      return { ...state, stickers: [], photoFilters: ['original', 'original', 'original', 'original'], showDate: false }
    case 'RESET_BOOTH':
      return {
        ...state,
        photos: [null, null, null, null],
        photoFilters: ['original', 'original', 'original', 'original'],
        photoCrops: [{ ...DEFAULT_CROP }, { ...DEFAULT_CROP }, { ...DEFAULT_CROP }, { ...DEFAULT_CROP }],
        stickers: [],
        showDate: false,
      }
    case 'SAVE_STRIP':
      return { ...state, savedStrips: [action.dataUrl, ...state.savedStrips] }
    default:
      return state
  }
}

const BoothStateContext = createContext(null)
const BoothDispatchContext = createContext(null)

export function BoothProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <BoothStateContext.Provider value={state}>
      <BoothDispatchContext.Provider value={dispatch}>{children}</BoothDispatchContext.Provider>
    </BoothStateContext.Provider>
  )
}

export function useBoothState() {
  const ctx = useContext(BoothStateContext)
  if (!ctx) throw new Error('useBoothState must be used within BoothProvider')
  return ctx
}

export function useBoothDispatch() {
  const ctx = useContext(BoothDispatchContext)
  if (!ctx) throw new Error('useBoothDispatch must be used within BoothProvider')
  return ctx
}
