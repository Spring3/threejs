import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ensureCanvasExists } from "../../common";
import { gsap } from 'gsap';

const loadingBarElement: HTMLDivElement | null = document.querySelector('.loading-bar');

/**
 * Loaders
 */
const loadingManager = new Three.LoadingManager(
  () => {
    console.log('loaded');
    window.setTimeout(() => {
      gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 2, value: 0 })
      if (loadingBarElement) {
        loadingBarElement.classList.add('ended');
        loadingBarElement.style.transform = '';
      }
    }, 500);
  },
  (itemUrl, itemsLoaded, itemsTotal) => {
    const progressRatio = itemsLoaded / itemsTotal;
    if (loadingBarElement) {
      loadingBarElement.style.transform = `scaleX(${progressRatio})`;
    }
  }
);

const gltfLoader = new GLTFLoader(loadingManager);
const cubeTextureLoader = new Three.CubeTextureLoader(loadingManager);

/**
 * Base
 */
// Debug
const debugObject = {
  envMapIntensity: 2.5,
};

// Canvas
const canvas = ensureCanvasExists();

// Scene
const scene = new Three.Scene();

const overlayGeometry = new Three.PlaneGeometry(2, 2, 1, 1);
const overlayMaterial = new Three.ShaderMaterial({
  transparent: true,
  vertexShader: `
    void main() {
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform float uAlpha;

    void main() {
      gl_FragColor = vec4(uColor, uAlpha);
    }
  `,
  uniforms: {
    uColor: { value: new Three.Color("red") },
    uAlpha: { value: 1 },
  },
});
const overlay = new Three.Mesh(overlayGeometry, overlayMaterial);

scene.add(overlay);

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof Three.Mesh &&
      child.material instanceof Three.MeshStandardMaterial
    ) {
      // child.material.envMap = environmentMap
      child.material.envMapIntensity = debugObject.envMapIntensity;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
  "/environmentMaps/0/px.png",
  "/environmentMaps/0/nx.png",
  "/environmentMaps/0/py.png",
  "/environmentMaps/0/ny.png",
  "/environmentMaps/0/pz.png",
  "/environmentMaps/0/nz.png",
]);

environmentMap.colorSpace = Three.SRGBColorSpace;

scene.background = environmentMap;
scene.environment = environmentMap;

/**
 * Models
 */
gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  gltf.scene.scale.set(10, 10, 10);
  gltf.scene.position.set(0, -4, 0);
  gltf.scene.rotation.y = Math.PI * 0.5;
  scene.add(gltf.scene);

  updateAllMaterials();
});

/**
 * Lights
 */
const directionalLight = new Three.DirectionalLight("#ffffff", 3);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, -2.25);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new Three.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(4, 1, -4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new Three.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.toneMapping = Three.ReinhardToneMapping;
renderer.toneMappingExposure = 3;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = Three.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
