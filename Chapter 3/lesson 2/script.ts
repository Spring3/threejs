import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'lil-gui'
import { ensureCanvasExists } from '../../common'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = ensureCanvasExists();

// Scene
const scene = new Three.Scene()

const glftLoader = new GLTFLoader()

glftLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
  scene.add(gltf.scene)
});

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

glftLoader.setDRACOLoader(dracoLoader);

glftLoader.load('/models/Duck/glTF-Draco/Duck.gltf', (data) => {
  scene.add(data.scene);
})

let mixer;
glftLoader.load('/models/Fox/glTF/Fox.gltf', (data) => {
  mixer = new Three.AnimationMixer(data.scene);
  const action = mixer.clipAction(data.animations[0]);

  action.play();

  data.scene.scale.set(0.03, 0.03, 0.03);
  scene.add(data.scene);
})

/**
 * Floor
 */
const floor = new Three.Mesh(
    new Three.PlaneGeometry(10, 10),
    new Three.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new Three.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new Three.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
const camera = new Three.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new Three.WebGLRenderer({
    canvas: canvas
})

renderer.shadowMap.enabled = true
renderer.shadowMap.type = Three.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new Three.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    controls.update()
    if (mixer) {
      mixer.update(deltaTime);
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
