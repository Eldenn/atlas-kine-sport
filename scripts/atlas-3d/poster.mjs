// Captures the still frame of the 3D Atlas (the one reduced motion shows) as the poster image the
// pre-rendered page displays before Three.js loads, or instead of it.
//
//   pnpm dev   # in another terminal
//   node scripts/atlas-3d/poster.mjs [http://localhost:3000/]
//   python3 scripts/atlas-3d/poster-webp.py
//
// Needs Playwright with Chromium (software WebGL through SwiftShader is enough).
import { createRequire } from 'node:module'

// require() so a global Playwright (NODE_PATH) is found too; it is not a dependency of the site.
const { chromium } = createRequire(import.meta.url)('playwright')

const url = process.argv[2] ?? 'http://localhost:3000/'
const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
// Desktop: the figure's 5:6 frame is about 660px wide; scale 1.7 gives the 1120px image.
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1.7,
  reducedMotion: 'reduce',
})
await page.addInitScript(() => sessionStorage.setItem('atlas-intro', '1'))
await page.goto(url, { waitUntil: 'networkidle' })
const canvas = page.locator('[data-atlas-3d] canvas')
// The poster is the frame's part of the canvas (the canvas itself spans the whole stage).
const frame = page.locator('[data-atlas-3d] > div')
await canvas.scrollIntoViewIfNeeded()
await page.waitForFunction(
  () => getComputedStyle(document.querySelector('[data-atlas-3d] canvas')).opacity === '1',
  null,
  { timeout: 30_000 },
)
// Transparent around the figure, so the poster sits on any ground.
await page.addStyleTag({
  content: '*{background:transparent!important}.atlas-stage__word{visibility:hidden}',
})
await frame.screenshot({ path: 'scripts/atlas-3d/poster.png', omitBackground: true })
await browser.close()
console.log('scripts/atlas-3d/poster.png')
