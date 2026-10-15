import { useRef } from 'react'
import { buttonLibrary, iconLibrary } from '../assets/assetLibrary.js'
import PixelButton from './PixelButton.jsx'

const readAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

export default function SourceSelect({ onTakePhoto, onGalleryFiles, maxFiles = 4, disabled }) {
  const fileInputRef = useRef(null)

  async function handleFileChange(e) {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/')).slice(0, maxFiles)
    e.target.value = ''
    if (!files.length) return
    const urls = await Promise.all(files.map(readAsDataUrl)) // keeps the order you picked them in
    onGalleryFiles(urls)
  }

  return (
    <div className="source-select">
      <PixelButton src={buttonLibrary.takePhoto || iconLibrary.camera} label="Take Photos" onClick={onTakePhoto} disabled={disabled} />
      <PixelButton
        src={buttonLibrary.chooseGallery || iconLibrary.gallery}
        label="Choose from Gallery"
        onClick={() => fileInputRef.current?.click()}
        variant="secondary"
        disabled={disabled}
      />
      <input ref={fileInputRef} type="file" accept="image/*" multiple className="sr-only-input" onChange={handleFileChange} />
    </div>
  )
}
