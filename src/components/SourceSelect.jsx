import { useRef } from 'react'
import { buttonLibrary, iconLibrary } from '../assets/assetLibrary.js'
import PixelButton from './PixelButton.jsx'

export default function SourceSelect({ onTakePhoto, onGalleryFile, disabled }) {
  const fileInputRef = useRef(null)

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onGalleryFile(reader.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="source-select">
      <PixelButton
        src={buttonLibrary.takePhoto || iconLibrary.camera}
        label="Take Photo"
        onClick={onTakePhoto}
        disabled={disabled}
      />
      <PixelButton
        src={buttonLibrary.chooseGallery || iconLibrary.gallery}
        label="Choose from Gallery"
        onClick={() => fileInputRef.current?.click()}
        variant="secondary"
        disabled={disabled}
      />
      <input ref={fileInputRef} type="file" accept="image/*" className="sr-only-input" onChange={handleFileChange} />
    </div>
  )
}
