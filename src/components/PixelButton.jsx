import { isMissing } from '../utils/placeholder.js'

export default function PixelButton({ src, label, onClick, variant = 'primary', disabled, className = '' }) {
  if (isMissing(src)) {
    return (
      <button className={`pixel-btn placeholder ${variant} ${className}`} onClick={onClick} disabled={disabled}>
        {label}
      </button>
    )
  }
  return (
    <button
      className={`pixel-btn art ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{ backgroundImage: `url(${src})` }}
    >
      <span className="sr-only">{label}</span>
    </button>
  )
}
