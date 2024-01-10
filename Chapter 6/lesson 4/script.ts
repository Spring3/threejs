import { GUI } from "lil-gui";
import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { ensureCanvasExists } from "../../common";
import firefliesVertexShader from "./shaders/fireflies/vertex.glsl";
import firefliesFragmentShader from "./shaders/fireflies/fragment.glsl";
import portalVertexShader from "./shaders/portal/vertex.glsl";
import portalFragmentShader from "./shaders/portal/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new GUI({
  width: 400,
});

// Canvas
const canvas = ensureCanvasExists();

// Scene
const scene = new Three.Scene();

/**
 * Loaders
 */
// Texture loader
const textureLoader = new Three.TextureLoader();

// Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("draco/");

// GLTF loader
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

const debugObject = {
  colorStart: '#9126ff',
  colorEnd: '#9126ff'
}

gui.addColor(debugObject, 'colorStart').onChange(() => {
  portalLightMaterial.uniforms.uColorStart.value.set(debugObject.colorStart);
});

gui.addColor(debugObject, 'colorEnd').onChange(() => {
  portalLightMaterial.uniforms.uColorEnd.value.set(debugObject.colorEnd);
});

/**
 * Object
 */

const bakedTexture = textureLoader.load(
  "portalScene/PortalSceneBakedDenoise.jpg"
);
bakedTexture.flipY = false;
bakedTexture.colorSpace = Three.SRGBColorSpace;

const bakedMaterial = new Three.MeshBasicMaterial({ map: bakedTexture });

const poleLightMaterial = new Three.MeshBasicMaterial({ color: 0xffffe5 });
const portalLightMaterial = new Three.ShaderMaterial({
  vertexShader: portalVertexShader,
  fragmentShader: portalFragmentShader,
  side: Three.DoubleSide,
  transparent: true,
  uniforms: {
    uTime: { value: 0.0 },
    uColorStart: { value: new Three.Color('#9126ff') },
    uColorEnd: { value: new Three.Color('#f0e2fd') }
  },
});

gltfLoader.load("portalScene/PortalSceneOptimized.glb", (gltf) => {
  gltf.scene.children.find((child) => {
    if (child.name.startsWith("PoleLight")) {
      child.material = poleLightMaterial;
    } else if (child.name === "PortalLight") {
      child.material = portalLightMaterial;
    } else {
      child.material = bakedMaterial;
    }
  });

  gltf.scene.rotateY(4.25)

  scene.add(gltf.scene);
});

const firefliesGeometry = new Three.BufferGeometry();
const fireflyCount = 30;
const positionArray = new Float32Array(fireflyCount * 3);
const scaleArray = new Float32Array(fireflyCount);

for (let i = 0; i < fireflyCount; i++) {
  positionArray[i * 3] = (Math.random() - 0.5) * 4;
  positionArray[i * 3 + 1] = (Math.random() + 0.2) * 1.5;
  positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;

  scaleArray[i] = Math.random();
}

firefliesGeometry.setAttribute(
  "position",
  new Three.BufferAttribute(positionArray, 3)
);
firefliesGeometry.setAttribute(
  "aScale",
  new Three.BufferAttribute(scaleArray, 1)
);

const firefliesMaterial = new Three.ShaderMaterial({
  vertexShader: firefliesVertexShader,
  fragmentShader: firefliesFragmentShader,
  transparent: true,
  blending: Three.AdditiveBlending,
  depthWrite: false,
  uniforms: {
    uTime: { value: 0.0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: { value: 150.0 },
  }
});
const fireflies = new Three.Points(firefliesGeometry, firefliesMaterial);
scene.add(fireflies);

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

  firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
});

/**
 * Camera
 */
// Base camera
const camera = new Three.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 6;
camera.position.y = 4;
camera.position.z = 3;
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
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(new Three.Color("#201919"));

/**
 * Animate
 */
const clock = new Three.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  firefliesMaterial.uniforms.uTime.value = elapsedTime;
  portalLightMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
