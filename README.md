# Pixel Photo Booth

Mobile-first, four-photo pixel-art photo booth. Runs entirely client-side (no backend, no cost to host).

```bash
npm install
npm run dev      # develop
npm run build    # outputs dist/ — upload this folder to Cloudflare Pages / Netlify
```

Deploy settings: build command `npm run build`, output directory `dist`.

Pixel photo filters live in `src/utils/filters.js` (PIXEL_MODES); strip patterns in `src/utils/stripBackgrounds.js`.
