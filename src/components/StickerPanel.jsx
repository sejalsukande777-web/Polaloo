import { useState } from 'react'
import { stickerLibrary } from '../assets/assetLibrary.js'
import { useBoothDispatch } from '../context/BoothContext.jsx'

const CATEGORY_LABELS = {
  hearts: 'Hearts',
  stars: 'Stars',
  characters: 'Cute Characters',
  flowers: 'Flowers',
  bows: 'Bows',
  food: 'Food',
  accessories: 'Accessories',
  seasonal: 'Seasonal',
  special: 'Special',
}

let stickerCounter = 0

export default function StickerPanel() {
  const dispatch = useBoothDispatch()
  const categories = Object.keys(stickerLibrary)
  const [activeCategory, setActiveCategory] = useState(
    categories.find((c) => stickerLibrary[c].length > 0) || categories[0]
  )
  const items = stickerLibrary[activeCategory] || []

  function addSticker(item) {
    dispatch({
      type: 'ADD_STICKER',
      sticker: {
        id: `sticker-${Date.now()}-${stickerCounter++}`,
        src: item.src,
        categoryId: activeCategory,
        x: 0.5,
        y: 0.5,
        size: 0.26,
        rotation: 0,
      },
    })
  }

  return (
    <div className="sticker-panel">
      <h3>Stickers</h3>
      <div className="sticker-category-tabs">
        {categories.map((c) => (
          <button
            key={c}
            className={`category-tab ${activeCategory === c ? 'active' : ''}`}
            onClick={() => setActiveCategory(c)}
          >
            {CATEGORY_LABELS[c] || c}
          </button>
        ))}
      </div>
      <div className="sticker-grid">
        {items.length === 0 ? (
          <div className="sticker-empty-tag">No {CATEGORY_LABELS[activeCategory] || activeCategory} stickers uploaded yet</div>
        ) : (
          items.map((item) => (
            <button key={item.id} className="sticker-thumb" onClick={() => addSticker(item)}>
              <img src={item.src} alt={item.label} draggable={false} />
            </button>
          ))
        )}
      </div>
    </div>
  )
}
