// The 3D Atlas of the home page: a bronze Atlas on one knee, the Earth on his shoulders. Plain
// Three.js in a canvas the React component hands over ("layered" pattern: the scene owns its render
// loop, React only mounts and disposes it). Loaded on demand, after the page is interactive.
//
// The statue is public/3d/atlas.glb (made with Meshy, optimised by scripts/atlas-3d/optimize.sh:
// ~59k triangles, 1024px WebP textures, Meshopt geometry). Its bronze is metallic, so it reflects a
// studio environment generated here (RoomEnvironment): no HDR file, nothing fetched from elsewhere.
//
// The home page holds it on a sticky stage for three beats (Bouger, Récupérer, Performer): the
// scroll through that stage drives a camera path between three framings (KEYS). Between scrolls
// nothing moves and nothing is drawn. Under reduced motion it draws the first framing only, the
// same as the poster image shown before it loads.
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
const deg = (d: number) => (d * Math.PI) / 180

/**
 * The camera path, one framing per beat of the stage (scroll progress 0, 0.5, 1).
 * turn: the statue's rotation; elevation: the camera's, negative is from below; zoom: 1 frames
 * the whole statue in the frame element, more is closer; aim: the height looked at, in metres;
 * shift: where the statue sits sideways, in frame widths (only where the canvas has room).
 */
const KEYS = [
  // Bouger: the whole statue, three-quarter view, a touch from below. Also the poster.
  { at: 0, turn: deg(-22), elevation: deg(-4), zoom: 1, aim: HEIGHT * 0.5, shift: 0 },
  // Récupérer: in profile, close on the shoulders taking the load, pushed right, off the text.
  { at: 0.5, turn: deg(58), elevation: deg(6), zoom: 1.7, aim: HEIGHT * 0.64, shift: 0.22 },
  // Performer: the other three-quarter, from low down, the whole figure again.
  { at: 1, turn: deg(108), elevation: deg(-12), zoom: 1.1, aim: HEIGHT * 0.5, shift: 0.04 },
] as const

const FOV = 26
/** What has to fit in the frame at zoom 1 (half extents, with a margin). */
const HALF_HEIGHT = HEIGHT / 2 + 0.06
const HALF_WIDTH = 0.6

export type AtlasScene = { dispose: () => void }

export type AtlasSceneOptions = {
  /** Where it draws: may be much larger than the frame, so a close framing is never cut short. */
  canvas: HTMLCanvasElement
  /** The statue's frame (the poster's box): the camera frames the statue in it, at zoom 1. */
  frame: HTMLElement
  modelUrl: string
  /** Scroll progress through the stage, 0 to 1 (read on scroll). */
  progress: () => number
  /** Draw the first framing and stop: no scroll path, no pointer parallax. */
  still: boolean
  onReady: () => void
}

export async function createAtlasScene(opts: AtlasSceneOptions): Promise<AtlasScene> {
  const { canvas, frame } = opts
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
  // The camera is set up for the frame element (its aspect, the statue fitted in it); a view
  // offset then widens the picture to the whole canvas, the frame at its place inside it. At
  // progress 0 the frame's part of the canvas is exactly the poster.
  let width = 0 // frame
  let height = 0
  let canvasWidth = 0
  let canvasHeight = 0
  let frameX = 0 // frame's position in the canvas
  let frameY = 0
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  /** 0 at the top of the page, 1 once the figure has scrolled out; eased towards. */
  const scroll = { p: 0, target: 0 }

  const target = new Vector3()

  /** The framing at progress p: smoothstep between the two keys around it. */
  function framing(p: number) {
    let i = 0
    while (i < KEYS.length - 2 && p > KEYS[i + 1]!.at) i++
    const a = KEYS[i]!
    const b = KEYS[i + 1]!
    let t = Math.min(1, Math.max(0, (p - a.at) / (b.at - a.at)))
    // Part linear, part smoothstep: it settles at each beat but never stands still.
    t = 0.45 * t + 0.55 * t * t * (3 - 2 * t)
    const mix = (x: number, y: number) => x + (y - x) * t
    return {
      turn: mix(a.turn, b.turn),
      elevation: mix(a.elevation, b.elevation),
      zoom: mix(a.zoom, b.zoom),
      aim: mix(a.aim, b.aim),
      shift: mix(a.shift, b.shift),
    }
  }

  function placeCamera() {
    const f = framing(scroll.p)
    turntable.rotation.y = f.turn
    const aspect = width / height || 1
    const tanV = Math.tan(((FOV / 2) * Math.PI) / 180)
    const fit = Math.max(HALF_HEIGHT / tanV, HALF_WIDTH / (tanV * aspect)) + 0.6
    const distance = fit / f.zoom
    const az = pointer.x * 0.08
    const el = f.elevation + pointer.y * 0.04
    target.set(0, f.aim, 0)
    camera.position.set(
      distance * Math.cos(el) * Math.sin(az),
      f.aim + distance * Math.sin(el),
      distance * Math.cos(el) * Math.cos(az),
    )
    camera.lookAt(target)
    // Room to the right of the frame decides how far the statue may move over.
    const room = Math.max(0, canvasWidth - (frameX + width))
    const shift = Math.min(f.shift * width, room * 0.6)
    camera.setViewOffset(width, height, -frameX - shift, -frameY, canvasWidth, canvasHeight)
  }

  function resize() {
    const c = canvas.getBoundingClientRect()
    const f = frame.getBoundingClientRect()
    canvasWidth = Math.max(1, Math.round(c.width))
    canvasHeight = Math.max(1, Math.round(c.height))
    width = Math.max(1, Math.round(f.width))
    height = Math.max(1, Math.round(f.height))
    frameX = Math.round(f.left - c.left)
    frameY = Math.round(f.top - c.top)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
    renderer.setSize(canvasWidth, canvasHeight, false)
    camera.aspect = width / height
    placeCamera()
  }

  // --- loop ------------------------------------------------------------------------------------
  let raf = 0
  let last = 0
  let onScreen = true

  function readScroll() {
    scroll.target = Math.min(1, Math.max(0, opts.progress()))
  }

  /** Eases a value towards its target; returns whether it is still moving. */
  function ease(value: { p: number; target: number }, k: number) {
    value.p += (value.target - value.p) * k
    if (Math.abs(value.target - value.p) < 1e-4) value.p = value.target
    return value.p !== value.target
  }

  function tick(now: number) {
    raf = 0
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
    last = now
    const k = Math.min(1, dt * 6)
    let moving = ease(scroll, k)
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
    raf = requestAnimationFrame(tick)
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
  resizeObserver.observe(frame)

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
  }
  placeCamera()
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
