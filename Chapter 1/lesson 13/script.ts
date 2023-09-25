import * as Three from 'three'
import { OrbitControls } from 'Three/examples/jsm/controls/OrbitControls'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { ensureCanvasExists } from '../common'
import { GUI } from 'lil-gui';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

Three.ColorManagement.enabled = false

const textureLoader = new Three.TextureLoader();
const fontLoader = new FontLoader();

const matcapTexture = textureLoader.load('/textures/matcaps/1.png');

/**
 * Base
 */
// Canvas
const canvas = ensureCanvasExists();

// Scene
const scene = new Three.Scene()
const axesHelper = new Three.AxesHelper();

scene.add(axesHelper);

const ambientLight = new Three.AmbientLight('white', 2);
const pointLight = new Three.PointLight('white', 5);

pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 1;

scene.add(ambientLight)
scene.add(pointLight); 

fontLoader.load('fonts/helvetica.json', (font) => {
  const textGeometry = new TextGeometry(
    'Hello Three.js',
    {
      font,
      size: 0.5,
      height: 0.2,
      curveSegments: 4,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5
    }
  )

  // textGeometry.computeBoundingBox();
  // textGeometry.translate(
  //   - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
  //   - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
  //   - (textGeometry.boundingBox.max.z - 0.03) * 0.5,
  // )

  textGeometry.center();

  const material = new Three.MeshMatcapMaterial({
    // wireframe: true,
    matcap: matcapTexture
  });

  const textMesh = new Three.Mesh(textGeometry, material);
  scene.add(textMesh);


  const donutGeometry = new Three.TorusGeometry(0.3, 0.2, 20, 45);

  for (let i = 0; i < 100; i++) {
    const donut = new Three.Mesh(
      donutGeometry,
      material
    );

    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);

    scene.add(donut);
  }
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
