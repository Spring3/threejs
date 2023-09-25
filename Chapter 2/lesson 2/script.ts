import * as Three from 'three';
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
const directionalLight = new Three.DirectionalLight('white', 2);
scene.add(directionalLight);
debug.add(directionalLight, 'visible').name('Directional Light');

directionalLight.castShadow = true;
directionalLight.shadow.mapSize = new Three.Vector2(1920, 1920);
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 2;

const pointLight = new Three.PointLight('white', 10)
pointLight.visible = false;
pointLight.position.x = 0
pointLight.position.y = 2
pointLight.position.z = 2
scene.add(pointLight)
debug.add(pointLight, 'visible').name('Point Light');

pointLight.castShadow = true;

const spotLight = new Three.SpotLight('white', 10, 6, Math.PI * 0.3);
spotLight.castShadow = true;
spotLight.position.set(0, 2, 2);
spotLight.shadow.mapSize = new Three.Vector2(1920, 1920);
spotLight.shadow.camera.fov = 10;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;

scene.add(spotLight);
scene.add(spotLight.target);

/**
 * Helpers
 */
const directionalLightHelper = new Three.DirectionalLightHelper(directionalLight, 0.2);
scene.add(directionalLightHelper);

const pointLightHelper = new Three.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

const directionalLightCameraHelper = new Three.CameraHelper(directionalLight.shadow.camera);
scene.add(directionalLightCameraHelper);

const spotLightHelper = new Three.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

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
sphere.castShadow = true

const cube = new Three.Mesh(
    new Three.BoxGeometry(0.75, 0.75, 0.75),
    material
)
cube.castShadow = true

const torus = new Three.Mesh(
    new Three.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5
torus.castShadow = true

const plane = new Three.Mesh(
    new Three.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65
plane.receiveShadow = true;

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

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = Three.PCFSoftShadowMap;

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
