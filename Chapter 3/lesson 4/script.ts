import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'lil-gui'
import { ensureCanvasExists } from '../../common'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader'
import { GroundProjectedSkybox } from 'three/examples/jsm/objects/GroundProjectedSkybox';
 
const textureLoader = new Three.TextureLoader();
const gltfLoader = new GLTFLoader();
// const rgbeLoader = new RGBELoader();
const exrLoader = new EXRLoader();
// const cubeTextureLoader = new Three.CubeTextureLoader();

// const environmentMap = cubeTextureLoader.load([
//   '/environmentMaps/0/px.png',
//   '/environmentMaps/0/nx.png',
//   '/environmentMaps/0/py.png',
//   '/environmentMaps/0/ny.png',
//   '/environmentMaps/0/pz.png',
//   '/environmentMaps/0/nz.png'
// ]);

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = ensureCanvasExists();

// Scene
const scene = new Three.Scene();

// const environmentMap = rgbeLoader.load('/environmentMaps/2k.hdr', (environmentMap) => {
//   environmentMap.mapping = Three.EquirectangularReflectionMapping;
//   scene.background = environmentMap;
//   scene.environment = environmentMap;
// });

// exrLoader.load('/environmentMaps/nvidiaCanvas-4k.exr', (environmentMap) => {
//   environmentMap.mapping = Three.EquirectangularReflectionMapping;

//   scene.environment = environmentMap;

//   const skybox = new GroundProjectedSkybox(environmentMap);
//   skybox.scale.setScalar(50);

//   scene.add(skybox)
// })

const environmentMap = textureLoader.load('/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg');
environmentMap.mapping = Three.EquirectangularReflectionMapping;
environmentMap.colorSpace = Three.SRGBColorSpace;
scene.background = environmentMap

const holyDonut = new Three.Mesh(
  new Three.TorusGeometry(8, 0.5),
  new Three.MeshBasicMaterial({ color: '#ffffff' })
)

holyDonut.position.y = 3.5;

holyDonut.layers.enable(1);

scene.add(holyDonut);

const cubeRenderTarget = new Three.WebGLCubeRenderTarget(256, { type: Three.HalfFloatType }); 
scene.environment = cubeRenderTarget.texture;

const cubeCamera = new Three.CubeCamera(0.1, 100, cubeRenderTarget);
cubeCamera.layers.set(1);

const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child instanceof Three.Mesh && child.material instanceof Three.MeshStandardMaterial) {
      // child.material.envMap = environmentMap;
      child.material.envMapIntensity = 3;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  })
}

// scene.environment = environmentMap;
// scene.background = environmentMap;
// scene.backgroundBlurriness = 0.1;

const torusKnot = new Three.Mesh(
  new Three.TorusGeometry(1, 0.4, 100, 16),
  new Three.MeshStandardMaterial({ roughness: 0.3, metalness: 1, color: '#aaaaaa'})
)

torusKnot.position.set(-4, 4, 0);
// torusKnot.material.envMap = environmentMap;
scene.add(torusKnot);

gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
  gltf.scene.scale.set(10, 10, 10);
  scene.add(gltf.scene);

  updateAllMaterials();
})

const light = new Three.AmbientLight('#ffffff', 2);
scene.add(light);

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

/**
 * Animate
 */
const clock = new Three.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    if (holyDonut) {
      holyDonut.rotation.x = Math.sin(elapsedTime) * 2;

      cubeCamera.update(renderer, scene);
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
