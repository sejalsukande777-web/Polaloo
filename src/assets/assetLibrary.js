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
    { id: 'heart-pink', label: 'Pink Heart', src: A(`${S}/hearts/heart-pink.png`) },
    { id: 'heart-peach', label: 'Peach Heart', src: A(`${S}/hearts/heart-peach.png`) },
    { id: 'heart-coral', label: 'Coral Heart', src: A(`${S}/hearts/heart-coral.png`) },
    { id: 'heart-butter', label: 'Butter Heart', src: A(`${S}/hearts/heart-butter.png`) },
    { id: 'heart-mint', label: 'Mint Heart', src: A(`${S}/hearts/heart-mint.png`) },
    { id: 'heart-aqua', label: 'Aqua Heart', src: A(`${S}/hearts/heart-aqua.png`) },
    { id: 'heart-sky', label: 'Sky Heart', src: A(`${S}/hearts/heart-sky.png`) },
    { id: 'heart-lavender', label: 'Lavender Heart', src: A(`${S}/hearts/heart-lavender.png`) },
    { id: 'heart-checker-pink', label: 'Checker Pink', src: A(`${S}/hearts/heart-checker-pink.png`) },
    { id: 'heart-checker-lavender', label: 'Checker Lavender', src: A(`${S}/hearts/heart-checker-lavender.png`) },
    { id: 'heart-checker-mint', label: 'Checker Mint', src: A(`${S}/hearts/heart-checker-mint.png`) },
    { id: 'heart-checker-butter', label: 'Checker Butter', src: A(`${S}/hearts/heart-checker-butter.png`) },
    { id: 'heart-balloon', label: 'Heart Balloon', src: A(`${S}/hearts/heart-balloon.png`) },
    { id: 'heart-arrow', label: 'Heart & Arrow', src: A(`${S}/hearts/heart-arrow.png`) },
    { id: 'heart-padlock', label: 'Heart Padlock', src: A(`${S}/hearts/heart-padlock.png`) },
    { id: 'love-heart', label: 'Love Heart', src: A(`${S}/hearts/love-heart.png`) },
    { id: 'gift-heart', label: 'Heart Gift', src: A(`${S}/hearts/gift-heart.png`) },
    { id: 'love-potion', label: 'Love Potion', src: A(`${S}/hearts/love-potion.png`) },
    { id: 'cupid-bow', label: 'Cupid Bow', src: A(`${S}/hearts/cupid-bow.png`) },
  ],
  stars: [
    { id: 'star-gold', label: 'Gold Star', src: A(`${S}/stars/star-gold.png`) },
    { id: 'star-red', label: 'Red Star', src: A(`${S}/stars/star-red.png`) },
    { id: 'shooting-star', label: 'Shooting Star', src: A(`${S}/stars/shooting-star.png`) },
    { id: 'sparkle-burst', label: 'Sparkle', src: A(`${S}/stars/sparkle-burst.png`) },
    { id: 'rocket', label: 'Rocket', src: A(`${S}/space/rocket.png`) },
    { id: 'ufo', label: 'UFO', src: A(`${S}/space/ufo.png`) },
    { id: 'alien', label: 'Alien', src: A(`${S}/space/alien.png`) },
    { id: 'astronaut-alien', label: 'Space Alien', src: A(`${S}/space/astronaut-alien.png`) },
    { id: 'planet', label: 'Planet', src: A(`${S}/space/planet.png`) },
    { id: 'comet', label: 'Comet', src: A(`${S}/space/comet.png`) },
    { id: 'night-moon', label: 'Night Moon', src: A(`${S}/space/night-moon.png`) },
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
  animals: [
    { id: 'capybara', label: 'Capybara', src: A(`${S}/animals/capybara.png`) },
    { id: 'otter', label: 'Otter', src: A(`${S}/animals/otter.png`) },
    { id: 'sloth', label: 'Sloth', src: A(`${S}/animals/sloth.png`) },
    { id: 'sheep', label: 'Sheep', src: A(`${S}/animals/sheep.png`) },
    { id: 'turtle', label: 'Turtle', src: A(`${S}/animals/turtle.png`) },
    { id: 'whale', label: 'Whale', src: A(`${S}/animals/whale.png`) },
    { id: 'deer', label: 'Deer', src: A(`${S}/animals/deer.png`) },
    { id: 'pig', label: 'Piglet', src: A(`${S}/animals/pig.png`) },
    { id: 'koala', label: 'Koala', src: A(`${S}/animals/koala.png`) },
    { id: 'panda', label: 'Panda', src: A(`${S}/animals/panda.png`) },
    { id: 'penguin', label: 'Penguin', src: A(`${S}/animals/penguin.png`) },
    { id: 'axolotl', label: 'Axolotl', src: A(`${S}/animals/axolotl.png`) },
    { id: 'bee', label: 'Bee', src: A(`${S}/animals/bee.png`) },
    { id: 'ladybug', label: 'Ladybug', src: A(`${S}/animals/ladybug.png`) },
    { id: 'snail', label: 'Snail', src: A(`${S}/animals/snail.png`) },
    { id: 'jellyfish', label: 'Jellyfish', src: A(`${S}/animals/jellyfish.png`) },
    { id: 'butterfly', label: 'Butterfly', src: A(`${S}/animals/butterfly.png`) },
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
    { id: 'potted-sprout', label: 'Potted Sprout', src: A(`${S}/flowers/potted-sprout.png`) },
    { id: 'watering-can', label: 'Watering Can', src: A(`${S}/flowers/watering-can.png`) },
    { id: 'potted-flowers', label: 'Potted Flowers', src: A(`${S}/flowers/potted-flowers.png`) },
    { id: 'flower-vase', label: 'Flower Vase', src: A(`${S}/flowers/flower-vase.png`) },
    { id: 'wreath-pink', label: 'Pink Wreath', src: A(`${S}/flowers/wreath-pink.png`) },
    { id: 'wreath-green', label: 'Green Wreath', src: A(`${S}/flowers/wreath-green.png`) },
    { id: 'wreath-rose', label: 'Rose Wreath', src: A(`${S}/flowers/wreath-rose.png`) },
    { id: 'bouquet', label: 'Bouquet', src: A(`${S}/flowers/bouquet.png`) },
    { id: 'lily-valley', label: 'Lily of the Valley', src: A(`${S}/flowers/lily-valley.png`) },
    { id: 'forget-me-not', label: 'Forget-Me-Not', src: A(`${S}/flowers/forget-me-not.png`) },
    { id: 'white-bells', label: 'White Bells', src: A(`${S}/flowers/white-bells.png`) },
    { id: 'larkspur', label: 'Purple Larkspur', src: A(`${S}/flowers/larkspur.png`) },
    { id: 'carnation', label: 'Pink Carnation', src: A(`${S}/flowers/carnation.png`) },
    { id: 'daisy-white', label: 'White Daisy', src: A(`${S}/flowers/daisy-white.png`) },
    { id: 'dahlia', label: 'Pink Dahlia', src: A(`${S}/flowers/dahlia.png`) },
    { id: 'cosmos-red', label: 'Red Cosmos', src: A(`${S}/flowers/cosmos-red.png`) },
    { id: 'daffodil', label: 'Daffodil', src: A(`${S}/flowers/daffodil.png`) },
    { id: 'grape-hyacinth', label: 'Grape Hyacinth', src: A(`${S}/flowers/grape-hyacinth.png`) },
    { id: 'poppy', label: 'Poppy', src: A(`${S}/flowers/poppy.png`) },
    { id: 'anemone', label: 'Anemone', src: A(`${S}/flowers/anemone.png`) },
  ],
  bows: [
    { id: 'bow-outline', label: 'Outline Bow', src: A(`${S}/bows/bow-outline.png`) },
    { id: 'bow-white', label: 'White Bow', src: A(`${S}/bows/bow-white.png`) },
    { id: 'bow-pink', label: 'Pink Bow', src: A(`${S}/bows/bow-pink.png`) },
    { id: 'bow-rose', label: 'Rose Bow', src: A(`${S}/bows/bow-rose.png`) },
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
    { id: 'cherries', label: 'Cherries', src: A(`${S}/food/cherries.png`) },
    { id: 'coffee', label: 'Coffee', src: A(`${S}/food/coffee.png`) },
    { id: 'croissant', label: 'Croissant', src: A(`${S}/food/croissant.png`) },
    { id: 'fries', label: 'Fries', src: A(`${S}/food/fries.png`) },
    { id: 'onigiri', label: 'Onigiri', src: A(`${S}/food/onigiri.png`) },
    { id: 'pancakes', label: 'Pancakes', src: A(`${S}/food/pancakes.png`) },
    { id: 'peach', label: 'Peach', src: A(`${S}/food/peach.png`) },
    { id: 'pizza-slice', label: 'Pizza', src: A(`${S}/food/pizza-slice.png`) },
    { id: 'ramen', label: 'Ramen', src: A(`${S}/food/ramen.png`) },
    { id: 'strawberry', label: 'Strawberry', src: A(`${S}/food/strawberry.png`) },
    { id: 'watermelon', label: 'Watermelon', src: A(`${S}/food/watermelon.png`) },
    { id: 'pudding', label: 'Pudding', src: A(`${S}/food/pudding.png`) },
    { id: 'mochi', label: 'Mochi', src: A(`${S}/food/mochi.png`) },
    { id: 'biscuit', label: 'Biscuit', src: A(`${S}/food/biscuit.png`) },
    { id: 'fruit-parfait', label: 'Fruit Parfait', src: A(`${S}/food/fruit-parfait.png`) },
    { id: 'teapot', label: 'Teapot', src: A(`${S}/food/teapot.png`) },
    { id: 'teacup', label: 'Teacup', src: A(`${S}/food/teacup.png`) },
    { id: 'honey-jar', label: 'Honey Jar', src: A(`${S}/food/honey-jar.png`) },
    { id: 'jam-toast', label: 'Jam Toast', src: A(`${S}/food/jam-toast.png`) },
  ],
  accessories: [
    { id: 'cat-ear-headphones', label: 'Cat Headphones', src: A(`${S}/accessories/cat-ear-headphones.png`) },
    { id: 'love-letter', label: 'Love Letter', src: A(`${S}/accessories/love-letter.png`) },
    { id: 'paw-print', label: 'Paw Print', src: A(`${S}/accessories/paw-print.png`) },
    { id: 'crescent-moon', label: 'Crescent Moon', src: A(`${S}/accessories/crescent-moon.png`) },
    { id: 'camera', label: 'Camera', src: A(`${S}/accessories/camera.png`) },
    { id: 'game-console', label: 'Game Console', src: A(`${S}/accessories/game-console.png`) },
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
    { id: 'mitten', label: 'Mitten', src: A(`${S}/seasonal/mitten.png`) },
    { id: 'snowman', label: 'Snowman', src: A(`${S}/seasonal/snowman.png`) },
    { id: 'hot-cocoa', label: 'Hot Cocoa', src: A(`${S}/seasonal/hot-cocoa.png`) },
    { id: 'gingerbread-man', label: 'Gingerbread', src: A(`${S}/seasonal/gingerbread-man.png`) },
    { id: 'bat', label: 'Bat', src: A(`${S}/seasonal/bat.png`) },
    { id: 'witch-hat', label: 'Witch Hat', src: A(`${S}/seasonal/witch-hat.png`) },
    { id: 'candy-corn', label: 'Candy Corn', src: A(`${S}/seasonal/candy-corn.png`) },
    { id: 'cauldron', label: 'Cauldron', src: A(`${S}/seasonal/cauldron.png`) },
  ],
  special: [
    { id: 'cloud', label: 'Cloud', src: A(`${S}/special/cloud.png`) },
    { id: 'sun', label: 'Sun', src: A(`${S}/special/sun.png`) },
    { id: 'magic-wand', label: 'Magic Wand', src: A(`${S}/special/magic-wand.png`) },
    { id: 'hot-air-balloon', label: 'Hot Air Balloon', src: A(`${S}/special/hot-air-balloon.png`) },
  ],
  party: [
    { id: 'party-hat', label: 'Party Hat', src: A(`${S}/party/party-hat.png`) },
    { id: 'balloons', label: 'Balloons', src: A(`${S}/party/balloons.png`) },
    { id: 'gift-box', label: 'Gift Box', src: A(`${S}/party/gift-box.png`) },
    { id: 'birthday-cake', label: 'Birthday Cake', src: A(`${S}/party/birthday-cake.png`) },
  ],
  summer: [
    { id: 'popsicle', label: 'Popsicle', src: A(`${S}/summer/popsicle.png`) },
    { id: 'sunglasses', label: 'Sunglasses', src: A(`${S}/summer/sunglasses.png`) },
    { id: 'beach-ball', label: 'Beach Ball', src: A(`${S}/summer/beach-ball.png`) },
    { id: 'seashell', label: 'Seashell', src: A(`${S}/summer/seashell.png`) },
  ],
  retro: [
    { id: 'cassette-tape', label: 'Cassette', src: A(`${S}/retro/cassette-tape.png`) },
    { id: 'vinyl-record', label: 'Vinyl', src: A(`${S}/retro/vinyl-record.png`) },
    { id: 'retro-phone', label: 'Retro Phone', src: A(`${S}/retro/retro-phone.png`) },
    { id: 'open-book', label: 'Open Book', src: A(`${S}/retro/open-book.png`) },
  ],
  nature: [
    { id: 'cactus', label: 'Cactus', src: A(`${S}/nature/cactus.png`) },
    { id: 'acorn', label: 'Acorn', src: A(`${S}/nature/acorn.png`) },
    { id: 'pine-tree', label: 'Pine Tree', src: A(`${S}/nature/pine-tree.png`) },
    { id: 'toadstool', label: 'Toadstool', src: A(`${S}/nature/toadstool.png`) },
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
