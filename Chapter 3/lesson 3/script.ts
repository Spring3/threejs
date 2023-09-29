import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'lil-gui'
import { ensureCanvasExists } from '../../common'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const gltfLoader = new GLTFLoader();

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = ensureCanvasExists();

// Scene
const scene = new Three.Scene()

const light = new Three.AmbientLight('white', 4);
scene.add(light);

let gltf: GLTF | null = null

gltfLoader.load('models/Duck/glTF-Binary/Duck.glb', (data) => {
  scene.add(data.scene);
  gltf = data;
})

/**
 * Objects
 */
const object1 = new Three.Mesh(
    new Three.SphereGeometry(0.5, 16, 16),
    new Three.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new Three.Mesh(
    new Three.SphereGeometry(0.5, 16, 16),
    new Three.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new Three.Mesh(
    new Three.SphereGeometry(0.5, 16, 16),
    new Three.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

const raycaster = new Three.Raycaster();

// const rayOrigin = new Three.Vector3(-3, 0, 0);
// const rayDirection = new Three.Vector3(10, 0, 0).normalize();

// raycaster.set(rayOrigin, rayDirection);

// const intersection = raycaster.intersectObject(object2);

// const intersects = raycaster.intersectObjects([object1, object2, object3]);

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
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new Three.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

let lastIntersect: Three.Intersection | null = null;
let mouse = new Three.Vector2();

window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;
})

window.addEventListener('click', () => {
  if (lastIntersect) {
    lastIntersect.object.material.color.set('yellow');
  }
})

/**
 * Animate
 */
const clock = new Three.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
    object3.position.y = Math.sin(elapsedTime * 1.3) * 1.5;

    raycaster.setFromCamera(mouse, camera);

    object1.material.color.set('red');
    object2.material.color.set('red');
    object3.material.color.set('red');

    // const rayOrigin = new Three.Vector3(-3, 0, 0);
    // const rayDirection = new Three.Vector3(1, 0, 0).normalize();

    // raycaster.set(rayOrigin, rayDirection);

    const intersections = raycaster.intersectObjects([object1, object2, object3]);

    for (const intersect of intersections) {
      intersect.object.material.color.set('#0000ff');
    }

    if (intersections.length) {
      lastIntersect = intersections[0]
    } else {
      lastIntersect = null;
    }

    if (gltf) {
      const intersection = raycaster.intersectObject(gltf.scene);
      if (intersection.length) {
        gltf.scene.scale.set(1.5, 1.5, 1.5);
      } else {
        gltf.scene.scale.set(1, 1, 1);
      }
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
