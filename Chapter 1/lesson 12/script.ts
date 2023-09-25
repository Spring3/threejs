import * as Three from 'three'
import { OrbitControls } from 'Three/examples/jsm/controls/OrbitControls'
import { ensureCanvasExists } from '../../common'
import { GUI } from 'lil-gui';

Three.ColorManagement.enabled = false

const textureLoader = new Three.TextureLoader();
const cubeTexxtureLoader = new Three.CubeTextureLoader();

const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

const environmentMapTexture = cubeTexxtureLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg'
])

const debug = new GUI();

/**
 * Base
 */
// Canvas
const canvas = ensureCanvasExists();

// Scene
const scene = new Three.Scene()

// const material = new Three.MeshBasicMaterial({
//   map: doorColorTexture,
//   alphaMap: doorAlphaTexture,
//   transparent: true
// })

// const material = new Three.MeshNormalMaterial({
//   flatShading: true,
// })

// const material = new Three.MeshMatcapMaterial({
//   matcap: matcapTexture
// })

// const material = new Three.MeshDepthMaterial()

// const material = new Three.MeshLambertMaterial();

// const material = new Three.MeshPhongMaterial({
//   shininess: 100,
//   specular: new Three.Color('blue')
// });

// const material = new Three.MeshToonMaterial({
//   gradientMap: gradientTexture,
// });
// gradientTexture.minFilter = Three.NearestFilter;
// gradientTexture.magFilter = Three.NearestFilter;
// gradientTexture.generateMipmaps = false;

// const material = new Three.MeshStandardMaterial({
//   // metalness: 0.5,
//   // roughness: 0.65,
//   map: doorColorTexture,
//   transparent: true,
//   alphaMap: doorAlphaTexture,
//   aoMap: doorAmbientOcclusionTexture,
//   aoMapIntensity: 1,
//   displacementMap: doorHeightTexture,
//   displacementScale: 0.1,
//   metalnessMap: doorMetalnessTexture,
//   roughnessMap: doorRoughnessTexture,
//   normalMap: doorNormalTexture,
//   normalScale: new Three.Vector2(0.5, 0.5)
// });

const material = new Three.MeshStandardMaterial({
  metalness: 0.7,
  roughness: 0.2,
  envMap: environmentMapTexture
});

debug.add(material, 'metalness').min(0).max(1).step(0.01);
debug.add(material, 'roughness').min(0).max(1).step(0.01);
debug.add(material, 'aoMapIntensity').min(0).max(10).step(0.01);
debug.add(material, 'displacementScale').min(0).max(1).step(0.01);

const ambientLight = new Three.AmbientLight('white', 2);
const pointLight = new Three.PointLight('white', 5);

pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 1;

scene.add(ambientLight)
scene.add(pointLight);

const sphere = new Three.Mesh(
  new Three.SphereGeometry(0.5, 64, 64),
  material
);

sphere.position.x = -1.5;

const plane = new Three.Mesh(
  new Three.PlaneGeometry(1, 1, 10, 10),
  material
)

const torus = new Three.Mesh(
  new Three.TorusGeometry(0.3, 0.2, 64, 128),
  material
)

torus.position.x = 1.5; 

scene.add(sphere, plane, torus);

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
    canvas
})
renderer.outputColorSpace = Three.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new Three.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    sphere.rotation.y = 0.1 * elapsedTime;
    plane.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;

    sphere.rotation.x = 0.15 * elapsedTime;
    plane.rotation.x = 0.15 * elapsedTime;
    torus.rotation.x = 0.15 * elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
