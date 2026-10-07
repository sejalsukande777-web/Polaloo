import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'

const CameraView = forwardRef(function CameraView({ facingMode = 'user', aspect = 1 }, ref) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [status, setStatus] = useState('requesting')

  useEffect(() => {
    let cancelled = false

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus('unsupported')
        return
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1080 }, height: { ideal: 1080 } },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        setStatus('ready')
      } catch (err) {
        setStatus('denied')
      }
    }

    start()
    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [facingMode])

  useImperativeHandle(ref, () => ({
    capture() {
      const video = videoRef.current
      if (!video || status !== 'ready') return null

      const vw = video.videoWidth
      const vh = video.videoHeight

      // Capture the FULL frame (not pre-cropped to the slot's aspect) so
      // the photo can be repositioned/zoomed later in the editor.
      const maxDim = 1600
      const scale = Math.min(1, maxDim / Math.max(vw, vh))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(vw * scale)
      canvas.height = Math.round(vh * scale)
      const ctx = canvas.getContext('2d')
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0)
        ctx.scale(-1, 1)
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      return canvas.toDataURL('image/png')
    },
  }))

  return (
    <div className="camera-view">
      {status === 'requesting' && <div className="camera-status">Requesting camera permission…</div>}
      {status === 'denied' && (
        <div className="camera-status error">
          Camera access denied. Enable camera permission in your browser settings, or use "Choose from Gallery" instead.
        </div>
      )}
      {status === 'unsupported' && (
        <div className="camera-status error">Camera not supported on this browser. Use "Choose from Gallery" instead.</div>
      )}
      <video
        ref={videoRef}
        className={`camera-feed ${facingMode === 'user' ? 'mirrored' : ''} ${status === 'ready' ? '' : 'hidden'}`}
        playsInline
        muted
        autoPlay
      />
    </div>
  )
})

export default CameraView
