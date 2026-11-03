// The 3D Atlas of the home page: a carved figure on one knee, the Earth on his shoulders. Plain
// Three.js in a canvas the React component hands over ("layered" pattern: the scene owns its render
// loop, React only mounts and disposes it). Loaded on demand, after the page is interactive.
//
// The figure is baked by scripts/atlas-3d/sculpt.py (a signed distance field, meshed, ambient
// occlusion per vertex); the land of the globe by scripts/atlas-3d/earth.py (Natural Earth). The
// globe is coloured here in the site's tones: mineral sea, antique gold land, a fine gold graticule.
//
// It draws only while it is on screen and the tab is visible. Under reduced motion it draws a single
// still frame, the same as the poster image shown before it loads.
import {
  ACESFilmicToneMapping,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  LinearMipmapLinearFilter,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from 'three'
import type { Texture } from 'three'

/** Keep in sync with scripts/atlas-3d/sculpt.py. */
const GLOBE_CENTER = new Vector3(0, 1.56, -0.24)
const GLOBE_RADIUS = 0.47
const AXIAL_TILT = (23.44 * Math.PI) / 180
/** One turn of the Earth, in seconds. Slow enough to read as weight, not as a spinner. */
const TURN_SECONDS = 70
/** France faces the viewer on the first frame (and on the poster). */
const START_LONGITUDE = 2

const TARGET = new Vector3(0, 1.02, 0.05)
const FOV = 26
const AZIMUTH = (38 * Math.PI) / 180
const ELEVATION = (7 * Math.PI) / 180
/** What has to fit in the frame, around TARGET (half extents, with a margin). */
const HALF_HEIGHT = 1.13
const HALF_WIDTH = 0.62

const BONE = '#e9e3da'
const GOLD = '#b0903d'
const SEA = '#1a2738'

export type AtlasScene = { dispose: () => void }

export type AtlasSceneOptions = {
  canvas: HTMLCanvasElement
  figureUrl: string
  landUrl: string
  /** Draw one still frame and stop: no turning globe, no pointer parallax. */
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
  renderer.toneMappingExposure = 1.05
  renderer.outputColorSpace = SRGBColorSpace

  const scene = new Scene()
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 50)

  // Light: a warm key from the upper front left, a cool sky fill, and a gold rim from behind on the
  // right that draws the silhouette against the mineral page.
  scene.add(new HemisphereLight('#cfd8e6', '#2b2418', 0.55))
  const key = new DirectionalLight('#fff3e2', 3.1)
  key.position.set(-2.2, 3.2, 3.0)
  scene.add(key)
  const rim = new DirectionalLight('#e2bd62', 4.5)
  rim.position.set(2.6, 2.2, -3.2)
  scene.add(rim)
  const fill = new DirectionalLight('#9fb2cc', 0.5)
  fill.position.set(2.5, 0.4, 2.5)
  scene.add(fill)

  const [figureGeometry, landTexture] = await Promise.all([
    loadFigure(opts.figureUrl),
    new TextureLoader().loadAsync(opts.landUrl),
  ])
  landTexture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy())
  landTexture.minFilter = LinearMipmapLinearFilter

  const figure = new Mesh(
    figureGeometry,
    new MeshStandardMaterial({ color: BONE, roughness: 0.58, metalness: 0, vertexColors: true }),
  )
  scene.add(figure)

  // The globe: tilted on its axis, turning about it.
  const tilt = new Group()
  tilt.position.copy(GLOBE_CENTER)
  tilt.rotation.z = -AXIAL_TILT
  const globeMaterial = createGlobeMaterial(landTexture)
  const globe = new Mesh(new SphereGeometry(GLOBE_RADIUS, 96, 64), globeMaterial)
  // SphereGeometry puts longitude 0 on +X; turn it to +Z, then to the starting meridian.
  const startTurn = -Math.PI / 2 - (START_LONGITUDE * Math.PI) / 180 + AZIMUTH
  globe.rotation.y = startTurn
  tilt.add(globe)
  scene.add(tilt)

  // A soft contact shadow on the floor; the floor itself stays the page.
  const shadow = new Mesh(
    new PlaneGeometry(1.5, 1.5),
    new MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }),
  )
  shadow.rotation.x = -Math.PI / 2
  shadow.position.set(0, 0.002, 0.04)
  shadow.scale.set(1, 0.85, 1)
  scene.add(shadow)

  // --- framing ---------------------------------------------------------------------------------
  let width = 0
  let height = 0
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }

  function placeCamera() {
    const aspect = width / height || 1
    const tanV = Math.tan(((FOV / 2) * Math.PI) / 180)
    const distance = Math.max(HALF_HEIGHT / tanV, HALF_WIDTH / (tanV * aspect)) + 0.9
    const az = AZIMUTH + pointer.x * 0.09
    const el = ELEVATION + pointer.y * 0.05
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
  let elapsed = 0

  function frame(now: number) {
    raf = 0
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0
    last = now
    elapsed += dt
    globe.rotation.y = startTurn + (elapsed / TURN_SECONDS) * Math.PI * 2
    pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 3)
    pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 3)
    placeCamera()
    renderer.render(scene, camera)
    schedule()
  }

  function schedule() {
    if (opts.still || raf || !onScreen || document.hidden) return
    raf = requestAnimationFrame(frame)
  }

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
  }
  if (!opts.still && finePointer) window.addEventListener('pointermove', onPointerMove)

  resize()
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
      scene.traverse((object) => {
        if (object instanceof Mesh) {
          object.geometry.dispose()
          const material = object.material as MeshStandardMaterial | ShaderMaterial
          material.dispose()
        }
      })
      landTexture.dispose()
      renderer.dispose()
    },
  }
}

/** Reads the binary written by sculpt.py: quantised positions, normals and baked occlusion. */
async function loadFigure(url: string): Promise<BufferGeometry> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${url}: ${response.status}`)
  const buffer = await response.arrayBuffer()
  const view = new DataView(buffer)
  const vertexCount = view.getUint32(0, true)
  const indexCount = view.getUint32(4, true)
  const min = [0, 1, 2].map((i) => view.getFloat32(8 + i * 4, true))
  const max = [0, 1, 2].map((i) => view.getFloat32(20 + i * 4, true))
  const pad4 = (n: number) => (n + 3) & ~3

  let offset = 32
  const q = new Int16Array(buffer, offset, vertexCount * 3)
  offset += pad4(q.byteLength)
  const normals = new Int8Array(buffer, offset, vertexCount * 3)
  offset += pad4(normals.byteLength)
  const occlusion = new Uint8Array(buffer, offset, vertexCount)
  offset += pad4(occlusion.byteLength)
  const indices = new Uint16Array(buffer, offset, indexCount)

  const positions = new Float32Array(vertexCount * 3)
  for (let i = 0; i < positions.length; i++) {
    const axis = i % 3
    positions[i] = min[axis]! + ((q[i]! + 32768) / 65535) * (max[axis]! - min[axis]!)
  }
  const colors = new Uint8Array(vertexCount * 3)
  for (let i = 0; i < vertexCount; i++) {
    colors[i * 3] = colors[i * 3 + 1] = colors[i * 3 + 2] = occlusion[i]!
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new BufferAttribute(normals, 3, true))
  geometry.setAttribute('color', new BufferAttribute(colors, 3, true))
  geometry.setIndex(new BufferAttribute(indices, 1))
  return geometry
}

function createGlobeMaterial(land: Texture) {
  const lin = (hex: string) => new Color(hex) // Color converts sRGB hex to the linear working space
  return new ShaderMaterial({
    uniforms: {
      land: { value: land },
      sea: { value: lin(SEA) },
      gold: { value: lin(GOLD) },
      keyDir: { value: new Vector3(-2.2, 3.2, 3.0).normalize() },
      rimDir: { value: new Vector3(2.6, 2.2, -3.2).normalize() },
      rimColor: { value: lin('#e2bd62') },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vUv = uv;
        vec4 world = modelMatrix * vec4(position, 1.0);
        vNormal = normalize(mat3(modelMatrix) * normal);
        vView = normalize(cameraPosition - world.xyz);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D land;
      uniform vec3 sea;
      uniform vec3 gold;
      uniform vec3 keyDir;
      uniform vec3 rimDir;
      uniform vec3 rimColor;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vView;

      float gridLine(float coord, float step) {
        float c = coord / step;
        float d = abs(fract(c - 0.5) - 0.5) / max(fwidth(c), 1e-4);
        return 1.0 - clamp(d - 0.25, 0.0, 1.0);
      }

      void main() {
        vec3 n = normalize(vNormal);
        vec3 v = normalize(vView);
        float isLand = texture2D(land, vUv).r;

        // Graticule every 15 degrees, on the sea only.
        float lon = vUv.x * 360.0;
        float lat = vUv.y * 180.0;
        float grid = max(gridLine(lon, 15.0), gridLine(lat, 15.0)) * (1.0 - isLand);

        vec3 base = mix(sea, gold, isLand);
        base = mix(base, gold * 0.75, grid * 0.32);

        float diffuse = max(dot(n, keyDir), 0.0);
        vec3 color = base * (0.22 + 0.78 * diffuse);

        // A little gloss on the sea, none on the land.
        vec3 h = normalize(keyDir + v);
        color += vec3(1.0, 0.95, 0.85) * pow(max(dot(n, h), 0.0), 90.0) * 0.08 * (1.0 - isLand);

        // Rim from behind, and a faint edge so the sphere reads against the page.
        float fresnel = pow(1.0 - max(dot(n, v), 0.0), 3.0);
        color += rimColor * fresnel * (0.06 + 0.45 * max(dot(n, rimDir), 0.0));

        gl_FragColor = vec4(color, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  })
}

function shadowTexture() {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(0,0,0,0.55)')
  gradient.addColorStop(0.45, 'rgba(0,0,0,0.28)')
  gradient.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return texture
}
