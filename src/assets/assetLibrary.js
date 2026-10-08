/**
 * CENTRALIZED ASSET CONFIGURATION
 * =================================
 * Single source of truth for every asset path. Components read from
 * here only — never hard-code a path in a component.
 */

// Bundler-safe asset URLs. Vite hashes + copies these into dist/ on build.
// (Plain '/src/assets/...' strings only work in dev and 404 in production.)
const assetUrls = import.meta.glob('./**/*.png', { eager: true, query: '?url', import: 'default' })
const A = (rel) => assetUrls[`./${rel}`]

// ---- BACKGROUNDS (still pending) ----
export const backgroundLibrary = {
  home: A('backgrounds/world.png'),
  booth: A('backgrounds/world.png'),
  editor: A('backgrounds/world.png'),
}

// Door animation frames: closed, ajar, open
export const doorLibrary = [A('decorations/door0.png'), A('decorations/door1.png'), A('decorations/door2.png')]

// ---- FRAMES (still pending) ----
export const frameLibrary = {
  fourStrip: null,
  // art-pixel aligned (120x360 grid): 100x64 windows, 12px gaps, roomy footer below
  fourStripSlots: [12, 88, 164, 240].map((y) => ({ x: 10 / 120, y: y / 360, w: 100 / 120, h: 64 / 360 })),

}

// ---- UI BUTTONS ----
// 8 of 11 generated; home/next/print still pending real art.
export const buttonLibrary = {
  home: null,
  start: A('buttons/start.png'),
  capture: A('buttons/capture.png'),
  takePhoto: A('buttons/takePhoto.png'),
  chooseGallery: A('buttons/chooseGallery.png'),
  download: A('buttons/download.png'),
  back: A('buttons/back.png'),
  reset: A('buttons/reset.png'),
  retake: A('buttons/retake.png'),
  next: null,
  print: null,
}

// ---- ICONS (still pending) ----
export const iconLibrary = {
  filter: null,
  sticker: null,
  camera: null,
  gallery: null,
  settings: null,
  trash: null,
}

// ---- DECORATIONS (still pending) ----
export const decorationLibrary = {
  homeAccents: [],
}

// ---- FONT (still pending) ----
export const fontLibrary = {
  pixelFont: null,
  fontFamily: null,
}

// ---- STICKERS ----
const S = 'stickers'

export const stickerLibrary = {
  hearts: [
    { id: 'heart-red', label: 'Red Heart', src: A(`${S}/hearts/heart-red.png`) },
    { id: 'heart-blue', label: 'Blue Heart', src: A(`${S}/hearts/heart-blue.png`) },
    { id: 'heart-purple', label: 'Purple Heart', src: A(`${S}/hearts/heart-purple.png`) },
    { id: 'heart-yellow', label: 'Yellow Heart', src: A(`${S}/hearts/heart-yellow.png`) },
  ],
  stars: [
    { id: 'star-gold', label: 'Gold Star', src: A(`${S}/stars/star-gold.png`) },
    { id: 'star-red', label: 'Red Star', src: A(`${S}/stars/star-red.png`) },
    { id: 'shooting-star', label: 'Shooting Star', src: A(`${S}/stars/shooting-star.png`) },
    { id: 'sparkle-burst', label: 'Sparkle', src: A(`${S}/stars/sparkle-burst.png`) },
  ],
  characters: [
    { id: 'cat', label: 'Cat', src: A(`${S}/characters/cat.png`) },
    { id: 'bear-cub', label: 'Bear Cub', src: A(`${S}/characters/bear-cub.png`) },
    { id: 'chick', label: 'Chick', src: A(`${S}/characters/chick.png`) },
    { id: 'bunny', label: 'Bunny', src: A(`${S}/characters/bunny.png`) },
    { id: 'fox', label: 'Fox', src: A(`${S}/characters/fox.png`) },
    { id: 'duckling', label: 'Duckling', src: A(`${S}/characters/duckling.png`) },
    { id: 'frog', label: 'Frog', src: A(`${S}/characters/frog.png`) },
    { id: 'hedgehog', label: 'Hedgehog', src: A(`${S}/characters/hedgehog.png`) },
    { id: 'ghost', label: 'Ghost', src: A(`${S}/characters/ghost.png`) },
    { id: 'mushroom', label: 'Mushroom', src: A(`${S}/characters/mushroom.png`) },
    { id: 'hamster-charm', label: 'Hamster Charm', src: A(`${S}/characters/hamster-charm.png`) },
    { id: 'teddy-bear', label: 'Teddy Bear', src: A(`${S}/characters/teddy-bear.png`) },
    { id: 'raccoon', label: 'Raccoon', src: A(`${S}/characters/raccoon.png`) },
  ],
  flowers: [
    { id: 'rose', label: 'Rose', src: A(`${S}/flowers/rose.png`) },
    { id: 'lavender-sprig', label: 'Lavender', src: A(`${S}/flowers/lavender-sprig.png`) },
    { id: 'cherry-blossom-sprig', label: 'Cherry Blossom', src: A(`${S}/flowers/cherry-blossom-sprig.png`) },
    { id: 'daisy', label: 'Daisy', src: A(`${S}/flowers/daisy.png`) },
    { id: 'sunflower', label: 'Sunflower', src: A(`${S}/flowers/sunflower.png`) },
    { id: 'orange-flower', label: 'Orange Flower', src: A(`${S}/flowers/orange-flower.png`) },
    { id: 'tulip-row', label: 'Tulip Row', src: A(`${S}/flowers/tulip-row.png`) },
    { id: 'peony', label: 'Peony', src: A(`${S}/flowers/peony.png`) },
    { id: 'flower-bouquet', label: 'Flower Bouquet', src: A(`${S}/flowers/flower-bouquet.png`) },
    { id: 'violet', label: 'Violet', src: A(`${S}/flowers/violet.png`) },
  ],
  bows: [
    { id: 'simple-bow', label: 'Bow', src: A(`${S}/bows/simple-bow.png`) },
    { id: 'layered-bow', label: 'Layered Bow', src: A(`${S}/bows/layered-bow.png`) },
    { id: 'hair-bow-tails', label: 'Hair Bow', src: A(`${S}/bows/hair-bow-tails.png`) },
    { id: 'polka-dot-bow', label: 'Polka Dot Bow', src: A(`${S}/bows/polka-dot-bow.png`) },
  ],
  food: [
    { id: 'cupcake', label: 'Cupcake', src: A(`${S}/food/cupcake.png`) },
    { id: 'donut', label: 'Donut', src: A(`${S}/food/donut.png`) },
    { id: 'ice-cream-cone', label: 'Ice Cream', src: A(`${S}/food/ice-cream-cone.png`) },
    { id: 'macaron', label: 'Macaron', src: A(`${S}/food/macaron.png`) },
    { id: 'cake-slice', label: 'Cake Slice', src: A(`${S}/food/cake-slice.png`) },
    { id: 'bubble-tea', label: 'Bubble Tea', src: A(`${S}/food/bubble-tea.png`) },
    { id: 'cookie', label: 'Cookie', src: A(`${S}/food/cookie.png`) },
    { id: 'lollipop', label: 'Lollipop', src: A(`${S}/food/lollipop.png`) },
  ],
  accessories: [
    { id: 'cat-ear-headphones', label: 'Cat Headphones', src: A(`${S}/accessories/cat-ear-headphones.png`) },
    { id: 'love-letter', label: 'Love Letter', src: A(`${S}/accessories/love-letter.png`) },
    { id: 'paw-print', label: 'Paw Print', src: A(`${S}/accessories/paw-print.png`) },
    { id: 'crescent-moon', label: 'Crescent Moon', src: A(`${S}/accessories/crescent-moon.png`) },
  ],
  seasonal: [
    { id: 'autumn-leaf', label: 'Autumn Leaf', src: A(`${S}/seasonal/autumn-leaf.png`) },
    { id: 'snowflake', label: 'Snowflake', src: A(`${S}/seasonal/snowflake.png`) },
    { id: 'pumpkin', label: 'Pumpkin', src: A(`${S}/seasonal/pumpkin.png`) },
    { id: 'clover', label: 'Clover', src: A(`${S}/seasonal/clover.png`) },
    { id: 'christmas-tree', label: 'Christmas Tree', src: A(`${S}/seasonal/christmas-tree.png`) },
    { id: 'candy-cane', label: 'Candy Cane', src: A(`${S}/seasonal/candy-cane.png`) },
    { id: 'ornament', label: 'Ornament', src: A(`${S}/seasonal/ornament.png`) },
    { id: 'firework', label: 'Firework', src: A(`${S}/seasonal/firework.png`) },
    { id: 'easter-egg', label: 'Easter Egg', src: A(`${S}/seasonal/easter-egg.png`) },
  ],
  special: [
    { id: 'cloud', label: 'Cloud', src: A(`${S}/special/cloud.png`) },
    { id: 'sun', label: 'Sun', src: A(`${S}/special/sun.png`) },
  ],
}

// ---- FILTERS ----
export function getSticker(id) {
  for (const list of Object.values(stickerLibrary)) {
    const hit = list.find((s) => s.id === id)
    if (hit) return hit.src
  }
  return null
}

export const filterLibrary = [
  { id: 'original', label: 'Original', group: 'classic' },
  { id: 'vintage', label: 'Vintage', group: 'classic' },
  { id: 'bw', label: 'Black & White', group: 'classic' },
  { id: 'film', label: 'Film', group: 'classic' },
  { id: 'warm', label: 'Warm', group: 'classic' },
  { id: 'cool', label: 'Cool', group: 'classic' },
  { id: 'dreamy', label: 'Dreamy', group: 'classic' },
  { id: 'retro', label: 'Retro', group: 'classic' },
  { id: 'pixel', label: 'Pixel', group: 'pixel' },
  { id: 'candy', label: 'Candy', group: 'pixel' },
  { id: 'gameboy', label: 'Game Boy', group: 'pixel' },
  { id: 'arcade', label: 'Arcade', group: 'pixel' },
  { id: 'bitmap', label: '1-Bit', group: 'pixel' },
]

export function isPlaceholderMode() {
  return !backgroundLibrary.home && !frameLibrary.fourStrip
}
