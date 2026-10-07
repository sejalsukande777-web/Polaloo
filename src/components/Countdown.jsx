import { useEffect, useState } from 'react'

export default function Countdown({ onComplete, seconds = 3 }) {
  const [n, setN] = useState(seconds)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    if (n === 0) {
      setFlash(true)
      const capTimer = setTimeout(() => {
        onComplete()
      }, 350)
      return () => clearTimeout(capTimer)
    }
    const t = setTimeout(() => setN((v) => v - 1), 800)
    return () => clearTimeout(t)
  }, [n, onComplete])

  return (
    <div className={`countdown-overlay ${flash ? 'flash' : ''}`}>
      <div className="countdown-number" key={n}>{n === 0 ? 'SMILE!' : n}</div>
    </div>
  )
}
