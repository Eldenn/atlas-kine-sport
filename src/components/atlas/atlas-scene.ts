// The 3D Atlas of the home page: a bronze Atlas on one knee, the Earth on his shoulders. Plain
// Three.js in a canvas the React component hands over ("layered" pattern: the scene owns its render
// loop, React only mounts and disposes it). Loaded on demand, after the page is interactive.
//
// The statue is public/3d/atlas.glb (made with Meshy, optimised by scripts/atlas-3d/optimize.sh:
// ~59k triangles, 1024px WebP textures, Meshopt geometry). Its bronze is metallic, so it reflects a
// studio environment generated here (RoomEnvironment): no HDR file, nothing fetched from elsewhere.
//
// Scrolling turns it: from a three-quarter view at the top of the page to its profile as the hero
// leaves the screen, the camera rising a little. Between scrolls nothing moves and nothing is drawn.
// Under reduced motion it draws a single still frame, the same as the poster image shown before it
// loads.
import {
  ACESFilmicToneMapping,
  Box3,
  CanvasTexture,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

/** The statue is scaled to this height (metres), feet on the floor, centred on the vertical axis. */
const HEIGHT = 1.9
/** Where the statue faces at the top of the page (and on the poster): a three-quarter view. */
const START_TURN = (-22 * Math.PI) / 180
/** How far scrolling turns it, by the time the figure has left the screen. */
const SCROLL_TURN = (70 * Math.PI) / 180
/** The camera rises from slightly below to slightly above over the same scroll. */
const SCROLL_RISE = (12 * Math.PI) / 180

const TARGET = new Vector3(0, HEIGHT / 2, 0)
const FOV = 26
const ELEVATION = (-4 * Math.PI) / 180 // a touch from below: the heroic angle
/** What has to fit in the frame, around TARGET (half extents, with a margin). */
const HALF_HEIGHT = HEIGHT / 2 + 0.06
const HALF_WIDTH = 0.6

export type AtlasScene = { dispose: () => void }

export type AtlasSceneOptions = {
  canvas: HTMLCanvasElement
  modelUrl: string
  /** Draw one still frame and stop: no scroll turn, no pointer parallax. */
  still: boolean
  onReady: () => void
}

export async function createAtlasScene(opts: AtlasSceneOptions): Promise<AtlasScene> {
  const { canvas } = opts
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'low-power',
  })
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
  renderer.outputColorSpace = SRGBColorSpace

  const scene = new Scene()
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 50)

  // Reflections for the bronze: a neutral studio, dimmed so the lights below do the modelling.
  const pmrem = new PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const environment = pmrem.fromScene(room, 0.04).texture
  room.dispose()
  pmrem.dispose()
  scene.environment = environment
  scene.environmentIntensity = 0.55

  // A warm key from the upper front left, and a gold rim from behind on the right that draws the
  // silhouette against the mineral page.
  const key = new DirectionalLight('#fff1dc', 2.4)
  key.position.set(-2.2, 3.4, 3.0)
  scene.add(key)
  const rim = new DirectionalLight('#e2bd62', 3.6)
  rim.position.set(2.8, 2.4, -3.0)
  scene.add(rim)
  const fill = new DirectionalLight('#9fb2cc', 0.35)
  fill.position.set(2.5, 0.3, 2.5)
  scene.add(fill)

  const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(opts.modelUrl)
  const model = gltf.scene
  model.traverse((object) => {
    if (object instanceof Mesh) {
      const material = object.material as MeshStandardMaterial
      material.side = 0 // FrontSide: the mesh is closed, the back faces only cost fill rate
    }
  })
  // Normalise: feet on the floor, centred, HEIGHT tall.
  const box = new Box3().setFromObject(model)
  const size = box.getSize(new Vector3())
  const scale = HEIGHT / size.y
  const center = box.getCenter(new Vector3())
  model.scale.setScalar(scale)
  model.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale)
  const turntable = new Group()
  turntable.add(model)
  turntable.rotation.y = START_TURN
  scene.add(turntable)

  // A soft contact shadow on the floor; the floor itself stays the page.
  const shadow = new Mesh(
    new PlaneGeometry(1.6, 1.6),
    new MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }),
  )
  shadow.rotation.x = -Math.PI / 2
  shadow.position.set(0, 0.002, 0)
  shadow.scale.set(1, 0.8, 1)
  scene.add(shadow)

  // --- framing ---------------------------------------------------------------------------------
  let width = 0
  let height = 0
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  /** 0 at the top of the page, 1 once the figure has scrolled out; eased towards. */
  const scroll = { p: 0, target: 0 }

  function placeCamera() {
    const aspect = width / height || 1
    const tanV = Math.tan(((FOV / 2) * Math.PI) / 180)
    const distance = Math.max(HALF_HEIGHT / tanV, HALF_WIDTH / (tanV * aspect)) + 0.6
    const az = pointer.x * 0.08
    const el = ELEVATION + scroll.p * SCROLL_RISE + pointer.y * 0.04
    camera.position.set(
      TARGET.x + distance * Math.cos(el) * Math.sin(az),
      TARGET.y + distance * Math.sin(el),
      TARGET.z + distance * Math.cos(el) * Math.cos(az),
    )
    camera.lookAt(TARGET)
  }

  function resize() {
    const rect = canvas.getBoundingClientRect()
    width = Math.max(1, Math.round(rect.width))
    height = Math.max(1, Math.round(rect.height))
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    placeCamera()
  }

  // --- loop ------------------------------------------------------------------------------------
  let raf = 0
  let last = 0
  let onScreen = true

  function readScroll() {
    const rect = canvas.getBoundingClientRect()
    const bottom = rect.bottom + window.scrollY
    scroll.target = Math.min(1, Math.max(0, window.scrollY / Math.max(1, bottom)))
  }

  /** Eases a value towards its target; returns whether it is still moving. */
  function ease(value: { p: number; target: number }, k: number) {
    value.p += (value.target - value.p) * k
    if (Math.abs(value.target - value.p) < 1e-4) value.p = value.target
    return value.p !== value.target
  }

  function frame(now: number) {
    raf = 0
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
    last = now
    const k = Math.min(1, dt * 6)
    let moving = ease(scroll, k)
    turntable.rotation.y = START_TURN + scroll.p * SCROLL_TURN
    const px = { p: pointer.x, target: pointer.tx }
    const py = { p: pointer.y, target: pointer.ty }
    moving = ease(px, k / 2) || moving
    moving = ease(py, k / 2) || moving
    pointer.x = px.p
    pointer.y = py.p
    placeCamera()
    renderer.render(scene, camera)
    // Draw again only while something is still settling; scroll and mouse wake the loop.
    if (moving) schedule()
    else last = 0
  }

  function schedule() {
    if (opts.still || raf || !onScreen || document.hidden) return
    raf = requestAnimationFrame(frame)
  }

  const onScroll = () => {
    readScroll()
    schedule()
  }
  if (!opts.still) window.addEventListener('scroll', onScroll, { passive: true })

  function stop() {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
    last = 0
  }

  const resizeObserver = new ResizeObserver(() => {
    resize()
    if (opts.still || !raf) renderer.render(scene, camera)
  })
  resizeObserver.observe(canvas)

  const visibility = new IntersectionObserver(([entry]) => {
    onScreen = entry?.isIntersecting ?? true
    if (onScreen) schedule()
    else stop()
  })
  visibility.observe(canvas)

  const onVisibilityChange = () => {
    if (document.hidden) stop()
    else schedule()
  }
  document.addEventListener('visibilitychange', onVisibilityChange)

  // A small parallax that follows a mouse (not touch: a finger scrolls the page).
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const onPointerMove = (event: PointerEvent) => {
    pointer.tx = (event.clientX / window.innerWidth) * 2 - 1
    pointer.ty = (event.clientY / window.innerHeight) * 2 - 1
    schedule()
  }
  if (!opts.still && finePointer) window.addEventListener('pointermove', onPointerMove)

  resize()
  // Arriving mid-page (reload, back button): start where the scroll already is, no catch-up turn.
  if (!opts.still) {
    readScroll()
    scroll.p = scroll.target
    turntable.rotation.y = START_TURN + scroll.p * SCROLL_TURN
    placeCamera()
  }
  renderer.compile(scene, camera)
  renderer.render(scene, camera)
  opts.onReady()
  schedule()

  return {
    dispose() {
      stop()
      resizeObserver.disconnect()
      visibility.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', onScroll)
      scene.traverse((object) => {
        if (object instanceof Mesh) {
          object.geometry.dispose()
          const material = object.material as MeshStandardMaterial
          for (const map of [
            material.map,
            material.normalMap,
            material.roughnessMap,
            material.metalnessMap,
          ]) {
            map?.dispose()
          }
          material.dispose()
        }
      })
      environment.dispose()
      renderer.dispose()
    },
  }
}

function shadowTexture() {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(0,0,0,0.6)')
  gradient.addColorStop(0.45, 'rgba(0,0,0,0.3)')
  gradient.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return texture
}
