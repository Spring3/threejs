import * as Three from 'three';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'lil-gui'
import { ensureCanvasExists } from '../../common';

/**
 * Base
 */
// Debug
const debug = new GUI()

// Canvas
const canvas = ensureCanvasExists();

// Scene
const scene = new Three.Scene()

/**
 * Lights
 */
const ambientLight = new Three.AmbientLight('white', 2)
scene.add(ambientLight)
debug.add(ambientLight, 'visible').name('Ambient Light')

const directionalLight = new Three.DirectionalLight('red', 15);
scene.add(directionalLight);
debug.add(directionalLight, 'visible').name('Directional Light');

const hemisphereLight = new Three.HemisphereLight('blue', 'green');
scene.add(hemisphereLight);
debug.add(hemisphereLight, 'visible').name('Hemisphere Light');

const rectAreaLight = new Three.RectAreaLight('blue', 2, 5, 5);
scene.add(rectAreaLight);
debug.add(rectAreaLight, 'visible').name('Rect Area Light');

const spotLight = new Three.SpotLight('purple', 5, 2, Math.PI * .25, 0.25, 1)
scene.add(spotLight);
scene.add(spotLight.target);
debug.add(spotLight, 'visible').name('Spot Light');

const pointLight = new Three.PointLight('white', 10)
pointLight.position.x = 0
pointLight.position.y = 2
pointLight.position.z = 2
scene.add(pointLight)
debug.add(pointLight, 'visible').name('Point Light');

/**
 * Helpers
 */
const hemisphereLightHelper = new Three.HemisphereLightHelper(hemisphereLight, 0.1);
scene.add(hemisphereLightHelper);

const directionalLightHelper = new Three.DirectionalLightHelper(directionalLight, 0.2);
scene.add(directionalLightHelper);

const pointLightHelper = new Three.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

const spotLightHelper = new Three.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

/**
 * Objects
 */
// Material
const material = new Three.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new Three.Mesh(
    new Three.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new Three.Mesh(
    new Three.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new Three.Mesh(
    new Three.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new Three.Mesh(
    new Three.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

/**
 * Animate
 */
const clock = new Three.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
