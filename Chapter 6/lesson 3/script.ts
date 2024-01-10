import { GUI } from 'lil-gui'
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { ensureCanvasExists } from '../../common'

/**
 * Base
 */
// Debug
const gui = new GUI({
    width: 400
})

// Canvas
const canvas = ensureCanvasExists();

// Scene
const scene = new Three.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new Three.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Object
 */

const bakedTexture = textureLoader.load('portalScene/PortalSceneBakedDenoise.jpg');
bakedTexture.flipY = false;
bakedTexture.colorSpace = Three.SRGBColorSpace;

const bakedMaterial = new Three.MeshBasicMaterial({ map: bakedTexture });

const poleLightMaterial = new Three.MeshBasicMaterial({ color: 0xffffe5 });
const portalLightMaterial = new Three.MeshBasicMaterial({ color: 0x9126FF, side: Three.DoubleSide });

gltfLoader.load('portalScene/PortalSceneOptimized.glb', (gltf) => {

  gltf.scene.children.find((child) => {
    if (child.name.startsWith('PoleLight')) {
      child.material = poleLightMaterial;
    } else if (child.name === 'PortalLight') {
      child.material = portalLightMaterial;
    } else {
      child.material = bakedMaterial
    }
  })

  scene.add(gltf.scene);
});


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new Three.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new Three.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new Three.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
