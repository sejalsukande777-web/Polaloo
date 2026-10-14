import { computeCoverCrop } from './photoCrop.js'

// Face accessories that can auto-fit onto a detected face.
//  t:'eyes' -> sized from the distance between the eyes, anchored on the eyes
//  t:'head' -> sized from the face width, anchored at the top of the head
//  a: the point inside the sticker (fraction of its square) that lands on the face anchor
//  k: sticker side length / reference length      dy: extra lift along the head's "up" direction (in face heights)
export const FACE_ACCESSORIES = [
  { id: 'bunny-ears',       label: 'Bunny Ears',        t: 'head', a: [0.5, 0.53], k: 1.3,  dy: 0.16 },
  { id: 'brown-ears',       label: 'Brown Ears',        t: 'head', a: [0.5, 0.45], k: 1.12, dy: 0.2 },
  { id: 'cat-ears-glasses', label: 'Cat Ears & Glasses', t: 'eyes', a: [0.5, 0.67], k: 2.75 },
  { id: 'heart-sunglasses', label: 'Heart Sunglasses',  t: 'eyes', a: [0.5, 0.5],  k: 2.4 },
  { id: 'sunglasses',       label: 'Sunglasses',        t: 'eyes', a: [0.5, 0.5],  k: 2.3 },
  { id: 'witch-hat',        label: 'Witch Hat',         t: 'head', a: [0.5, 0.8],  k: 1.65, dy: -0.02 },
  { id: 'party-hat',        label: 'Party Hat',         t: 'head', a: [0.5, 0.95], k: 1.15, dy: 0.03 },
]

// Face finder (MediaPipe Face Mesh) is hosted with the app in /public, so nothing is fetched from other sites
// and photos never leave the device.
const BASE = '/mediapipe/face_mesh/'
let meshPromise = null
let pending = null
let chain = Promise.resolve()

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (window.FaceMesh) return resolve()
    const s = document.createElement('script')
    s.src = src
    s.onload = resolve
    s.onerror = () => reject(new Error('face finder script failed to load'))
    document.head.appendChild(s)
  })
}

function getFaceMesh() {
  if (!meshPromise) {
    meshPromise = (async () => {
      await loadScript(BASE + 'face_mesh.js')
      const fm = new window.FaceMesh({ locateFile: (f) => BASE + f })
      fm.setOptions({ maxNumFaces: 3, refineLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 })
      fm.onResults((r) => { if (pending) pending(r) })
      await fm.initialize()
      return fm
    })().catch((e) => { meshPromise = null; throw e })
  }
  return meshPromise
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// Returns { faces: [landmarks[468+]], w, h } for a photo (data URL). Calls are queued one at a time.
export function detectFaces(dataUrl) {
  const run = async () => {
    const fm = await getFaceMesh()
    const img = await loadImage(dataUrl)
    const scale = Math.min(1, 1024 / Math.max(img.naturalWidth, img.naturalHeight))
    const c = document.createElement('canvas')
    c.width = Math.round(img.naturalWidth * scale)
    c.height = Math.round(img.naturalHeight * scale)
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
    const results = await new Promise((resolve, reject) => {
      pending = resolve
      fm.send({ image: c }).catch(reject)
    })
    pending = null
    return { faces: results.multiFaceLandmarks || [], w: img.naturalWidth, h: img.naturalHeight }
  }
  const p = chain.then(run, run)
  chain = p.catch(() => {})
  return p
}

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])

// Turns detected faces into sticker placements (x, y, size, rotation) on the photo strip,
// taking the photo's slot and the user's crop/zoom into account.
export function faceStickers({ faces, w, h, acc, slot, crop }) {
  const ratio = (slot.w * 1200) / (slot.h * 3600)
  const c = computeCoverCrop(w, h, ratio, crop.zoom, crop.panX, crop.panY)
  const out = []
  faces.forEach((lm) => {
    const P = (i) => [lm[i].x * w, lm[i].y * h]
    let eL = [(P(33)[0] + P(133)[0]) / 2, (P(33)[1] + P(133)[1]) / 2]
    let eR = [(P(362)[0] + P(263)[0]) / 2, (P(362)[1] + P(263)[1]) / 2]
    if (eL[0] > eR[0]) [eL, eR] = [eR, eL]
    const ipd = dist(eL, eR)
    const roll = (Math.atan2(eR[1] - eL[1], eR[0] - eL[0]) * 180) / Math.PI
    const top = P(10), chin = P(152)
    const faceH = dist(top, chin)
    const up = [(top[0] - chin[0]) / faceH, (top[1] - chin[1]) / faceH]
    const faceW = dist(P(234), P(454))
    const eyeMid = [(eL[0] + eR[0]) / 2, (eL[1] + eR[1]) / 2]

    // skip faces that were cropped out of this photo's window
    if (eyeMid[0] < c.sx || eyeMid[0] > c.sx + c.sw || eyeMid[1] < c.sy || eyeMid[1] > c.sy + c.sh) return

    const side = acc.k * (acc.t === 'eyes' ? ipd : faceW)
    const target = acc.t === 'eyes'
      ? eyeMid
      : [top[0] + up[0] * (acc.dy || 0) * faceH, top[1] + up[1] * (acc.dy || 0) * faceH]
    const th = (roll * Math.PI) / 180
    const ox = (acc.a[0] - 0.5) * side, oy = (acc.a[1] - 0.5) * side
    const cx = target[0] - (ox * Math.cos(th) - oy * Math.sin(th))
    const cy = target[1] - (ox * Math.sin(th) + oy * Math.cos(th))

    out.push({
      x: slot.x + ((cx - c.sx) / c.sw) * slot.w,
      y: slot.y + ((cy - c.sy) / c.sh) * slot.h,
      size: (side / c.sw) * slot.w,
      rotation: roll,
      _order: cx,
    })
  })
  return out.sort((a, b) => a._order - b._order).map(({ _order, ...s }) => s)
}
