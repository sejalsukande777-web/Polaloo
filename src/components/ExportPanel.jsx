import { useState } from 'react'
import { useBoothState, useBoothDispatch } from '../context/BoothContext.jsx'
import { composePhotoStrip, canvasToDownload } from '../utils/exportCanvas.js'
import { buttonLibrary } from '../assets/assetLibrary.js'
import PixelButton from './PixelButton.jsx'

export default function ExportPanel() {
  const state = useBoothState()
  const dispatch = useBoothDispatch()
  const [busy, setBusy] = useState(false)

  async function buildCanvas() {
    return composePhotoStrip({
      photos: state.photos,
      filters: state.photoFilters,
      stickers: state.stickers,
      showDate: state.showDate,
      backgroundId: state.stripBackground,
      photoCrops: state.photoCrops,
      pixelSize: state.pixelSize,
    })
  }

  async function handleDownload(type) {
    setBusy(true)
    try {
      const canvas = await buildCanvas()
      const ext = type === 'image/jpeg' ? 'jpg' : 'png'
      await canvasToDownload(canvas, `photo-strip-${Date.now()}.${ext}`, type)
      dispatch({ type: 'SAVE_STRIP', dataUrl: canvas.toDataURL('image/png') })
    } finally {
      setBusy(false)
    }
  }

  async function handlePrint() {
    setBusy(true)
    try {
      const canvas = await buildCanvas()
      const dataUrl = canvas.toDataURL('image/png')
      const printWindow = window.open('', '_blank')
      printWindow.document.write(`
        <html>
          <head><title>Print Photo Strip</title>
          <style>
            @page { margin: 0; }
            html, body { margin: 0; padding: 0; background: white; }
            img { display: block; width: 100%; height: auto; }
          </style>
          </head>
          <body>
            <img src="${dataUrl}" onload="window.print()" />
          </body>
        </html>
      `)
      printWindow.document.close()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="export-panel">
      <label className="apply-all-toggle">
        <input type="checkbox" checked={state.showDate} onChange={() => dispatch({ type: 'TOGGLE_DATE' })} />
        Include date
      </label>
      <div className="export-actions">
        <PixelButton src={buttonLibrary.download} label="Download PNG" onClick={() => handleDownload('image/png')} disabled={busy} />
        <PixelButton label="Download JPEG" variant="secondary" onClick={() => handleDownload('image/jpeg')} disabled={busy} />
        <PixelButton label="Print" variant="secondary" onClick={handlePrint} disabled={busy} />
      </div>
    </div>
  )
}
