import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "lil-gui";
import { ensureCanvasExists } from "../../common";
import * as cannon from "cannon-es";

/**
 * Debug
 */
const gui = new GUI();

const debugObject = {
  createSphere: () => {
    createSphere(
      Math.random() * 0.5,
      new Three.Vector3((Math.random() - 0.5) * 3, 3, (Math.random() - 0.5) * 3)
    );
  },
  createBox: () => {
    createBox(
      Math.random() * 0.5,
      Math.random() * 0.5,
      Math.random() * 0.5,
      new Three.Vector3((Math.random() - 0.5) * 3, 3, (Math.random() - 0.5) * 3)
    );
  },
  reset: () => {
    for (const object of objectsToUpdate) {
      object.body.removeEventListener('collide', playSound);
      world.removeBody(object.body);
      scene.remove(object.mesh);
    }
    objectsToUpdate.splice(0, objectsToUpdate.length);
  }
};

gui.add(debugObject, "createSphere");
gui.add(debugObject, 'createBox');
gui.add(debugObject, 'reset');

/**
 * Base
 */
// Canvas
const canvas = ensureCanvasExists();

// Scene
const scene = new Three.Scene();

const hitSound = new Audio('/sounds/hit.mp3');

const playSound = (collision: cannon.ICollisionEvent) => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal();

  if (impactStrength > 1.5) {
    hitSound.volume = Math.random();
    hitSound.currentTime = 0;
    hitSound.play();
  }
}

/**
 * Textures
 */
const textureLoader = new Three.TextureLoader();
const cubeTextureLoader = new Three.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);

const world = new cannon.World();
world.broadphase = new cannon.SAPBroadphase(world);
world.allowSleep = true;
world.gravity.set(0, -9.82, 0);

const defaultMaterial = new cannon.Material("default");
const defaultContactMaterial = new cannon.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);

world.addContactMaterial(defaultContactMaterial);

const objectsToUpdate: Array<{ mesh: Three.Mesh; body: cannon.Body }> = [];

const sphereGeometry = new Three.SphereGeometry(1, 20, 20);
const sphereMaterial = new Three.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
});

const createSphere = (radius: number, position: Three.Vector3) => {
  const mesh = new Three.Mesh(sphereGeometry, sphereMaterial);
  mesh.scale.set(radius, radius, radius);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  const shape = new cannon.Sphere(radius);
  const body = new cannon.Body({
    mass: 1,
    shape,
    material: defaultMaterial,
  });

  body.position.copy(position);
  body.addEventListener('collide', playSound);

  world.addBody(body);

  objectsToUpdate.push({ mesh, body });
};

createSphere(0.5, new Three.Vector3(0, 3, 0));

const boxGeometry = new Three.BoxGeometry(1, 1, 1);
const boxMaterial = new Three.MeshStandardMaterial({
  roughness: 0.5,
  envMap: environmentMapTexture,
});

const createBox = (
  width: number,
  height: number,
  depth: number,
  position: Three.Vector3
) => {
  const mesh = new Three.Mesh(boxGeometry, boxMaterial);
  mesh.scale.set(width, height, depth);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  const shape = new cannon.Box(new cannon.Vec3(width * 0.5, height * 0.5, depth * 0.5));
  const body = new cannon.Body({
    mass: 1,
    shape,
    material: defaultMaterial,
  });

  body.position.copy(position);
  body.addEventListener('collide', playSound);

  world.addBody(body);

  objectsToUpdate.push({ mesh, body });
};

// const sphereShape = new cannon.Sphere(0.5);
// const sphereBody = new cannon.Body({
//   mass: 1,
//   position: new cannon.Vec3(0, 3, 0),
//   shape: sphereShape,
//   material: defaultMaterial
// });

// sphereBody.applyLocalForce(new cannon.Vec3(100, 0, 0), cannon.Vec3.ZERO);
// world.addBody(sphereBody);

const floorShape = new cannon.Plane();
const floorBody = new cannon.Body({
  mass: 0,
  shape: floorShape,
  material: defaultMaterial,
});

floorBody.quaternion.setFromAxisAngle(new cannon.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);

/**
 * Test sphere
 */
// const sphere = new Three.Mesh(
//     new Three.SphereGeometry(0.5, 32, 32),
//     new Three.MeshStandardMaterial({
//         metalness: 0.3,
//         roughness: 0.4,
//         envMap: environmentMapTexture,
//         envMapIntensity: 0.5
//     })
// )
// sphere.castShadow = true
// sphere.position.y = 0.5
// scene.add(sphere)

/**
 * Floor
 */
const floor = new Three.Mesh(
  new Three.PlaneGeometry(10, 10),
  new Three.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new Three.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new Three.DirectionalLight(0xffffff, 2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
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
camera.position.set(-3, 3, 3);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new Three.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = Three.LinearSRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = Three.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new Three.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;

  oldElapsedTime = elapsedTime;

  // sphereBody.applyForce(new cannon.Vec3(-0.5, 0, 0), sphereBody.position);

  world.step(1 / 60, deltaTime, 3);

  for (const object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position);
    object.mesh.quaternion.copy(object.body.quaternion);
  }

  // sphere.position.copy(sphereBody.position);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
