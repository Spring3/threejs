import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { ensureCanvasExists } from '../../common'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()
const textureLoader = new Three.TextureLoader();

/**
 * Base
 */
// Debug
const gui = new GUI()
const params = {}

// Canvas
const canvas = ensureCanvasExists();

// Scene
const scene = new Three.Scene()

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child.isMesh && child.material.isMeshStandardMaterial)
        {
            child.material.envMapIntensity = params.envMapIntensity
            child.castShadow = true;
            child.receiveShadow = true;
        }
    })
}

/**
 * Environment map
 */
// Global intensity
params.envMapIntensity = 1
gui
    .add(params, 'envMapIntensity')
    .min(0)
    .max(10)
    .step(0.001)
    .onChange(updateAllMaterials)

// HDR (RGBE) equirectangular
rgbeLoader.load('/environmentMaps/0/2k.hdr', (environmentMap) =>
{
    environmentMap.mapping = Three.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.environment = environmentMap
})

const directionalLight= new Three.DirectionalLight('white', 3);
directionalLight.position.set(-4, 6.5, 2.5);
scene.add(directionalLight);

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntencity');
gui.add(directionalLight.position, 'x').min(-10).max(10).step(0.001).name('lightX');
gui.add(directionalLight.position, 'y').min(-10).max(10).step(0.001).name('lightY');
gui.add(directionalLight.position, 'z').min(-10).max(10).step(0.001).name('lightZ');

directionalLight.castShadow = true;
gui.add(directionalLight, 'castShadow');

directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(512, 512);

// helper

const directionalLightHelper = new Three.CameraHelper(directionalLight.shadow.camera);
scene.add(directionalLightHelper);

directionalLight.target.position.set(0, 40, 0);
directionalLight.target.updateMatrix();

/**
 * Models
 */
// Helmet
gltfLoader.load(
    '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(10, 10, 10)
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)

const floorColorTexture = textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg')
floorColorTexture.colorSpace = Three.SRGBColorSpace;
const floorNormalTexture = textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png')
const floorAORoughnesstMetalnessTexture = textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg');

const floor = new Three.Mesh(
  new Three.PlaneGeometry(8, 8),
  new Three.MeshStandardMaterial({
    map: floorColorTexture,
    normalMap: floorNormalTexture,
    aoMap: floorAORoughnesstMetalnessTexture,
    roughnessMap: floorAORoughnesstMetalnessTexture,
    metalnessMap: floorAORoughnesstMetalnessTexture
  })
)

floor.rotation.x = - Math.PI * 0.5;
scene.add(floor);

const wallColorTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg')
wallColorTexture.colorSpace = Three.SRGBColorSpace;
const wallNormalTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png')
const wallAORoughnesstMetalnessTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg');

const wall = new Three.Mesh(
  new Three.PlaneGeometry(8, 8),
  new Three.MeshStandardMaterial({
    map: wallColorTexture,
    normalMap: wallNormalTexture,
    aoMap: wallAORoughnesstMetalnessTexture,
    roughnessMap: wallAORoughnesstMetalnessTexture,
    metalnessMap: wallAORoughnesstMetalnessTexture
  })
)

wall.position.y = 4;
wall.position.z = -4;
scene.add(wall);

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
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
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

renderer.toneMapping = Three.ReinhardToneMapping;
renderer.toneMappingExposure = 3;

gui.add(renderer, 'toneMapping', {
  No: Three.NoToneMapping,
  Linear: Three.LinearToneMapping,
  Reinhard: Three.ReinhardToneMapping,
  Cineon: Three.CineonToneMapping,
  ACESFilmic: Three.ACESFilmicToneMapping,
})

gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001);

renderer.useLegacyLights = false;
gui.add(renderer, 'useLegacyLights');

renderer.shadowMap.enabled = true;
gui.add(renderer.shadowMap, 'enabled');

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
