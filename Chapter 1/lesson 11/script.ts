import * as Three from 'three';
import gsap from 'gsap';
import { ensureCanvasExists } from '../../common';
import { GUI } from 'lil-gui';

const loadingManager = new Three.LoadingManager();
const textureLoader = new Three.TextureLoader(loadingManager);

/**
 * Debug
 */

const debug = new GUI();

const resolution = {
  x: window.innerWidth,
  y: window.innerHeight
};

const canvas = ensureCanvasExists();

const scene = new Three.Scene();

const aspectRatio = resolution.x / resolution.y;
const camera = new Three.PerspectiveCamera(45, aspectRatio);
scene.add(camera);
camera.translateZ(10);

const axesHelper = new Three.AxesHelper();
scene.add(axesHelper);

const group = new Three.Group();
scene.add(group);

debug.add(group.position, 'y').min(-1).max(3).step(0.01).name('elevation');
debug.add(group, 'visible');

const greenCube = new Three.Mesh(
  new Three.BoxGeometry(),
  new Three.MeshBasicMaterial({ color: 'green' })
);
greenCube.position.x = -2;
group.add(greenCube);

const blueCube = new Three.Mesh(
  new Three.BoxGeometry(),
  new Three.MeshBasicMaterial({ color: 'blue' })
);
blueCube.position.x = 2;
group.add(blueCube);


/**
 * Textures
 */

const colorTexture = textureLoader.load('textures/door/color.jpg');

colorTexture.repeat.x = 2;
colorTexture.repeat.y = 3;

colorTexture.wrapS = Three.RepeatWrapping;
colorTexture.wrapT = Three.RepeatWrapping;

colorTexture.offset.x = 0.5;
colorTexture.offset.y = 0.5;

colorTexture.rotation = Math.PI * 0.25;

colorTexture.center.x = 0.5;
colorTexture.center.y = 0.5;

colorTexture.generateMipmaps = false;
colorTexture.magFilter = Three.NearestFilter;

const redCube = new Three.Mesh(
  new Three.BoxGeometry(),
  new Three.MeshBasicMaterial({ color: 'red', map: colorTexture }),
);

group.add(redCube);

/**
 *            x (0, 4, 0)
 *            | \
 *            |  \
 *  (0, 0, 0) x---x (4, 0, 0)
 */
const verticesPoints = new Float32Array([
  0, 0, 0, // vertice 1
  0, 4, 0, // vertice 2
  4, 0, 0  // vertice 3
]);

const facePositionAttribute = new Three.BufferAttribute(verticesPoints, 3)
const faceGeometry = new Three.BufferGeometry();
faceGeometry.setAttribute('position', facePositionAttribute);
const material = new Three.MeshBasicMaterial({
  color: 'red',
  wireframe: true
});
const face = new Three.Mesh(faceGeometry, material);
scene.add(face);

const facesCount = 50;
const verticeCount = facesCount * 3 * 3;
const plainVerticesPoints = new Float32Array(verticeCount);
for (let i = 0; i < verticeCount; i++) {
  plainVerticesPoints[i] = Math.random();
}
const plainPositionAttribute = new Three.BufferAttribute(plainVerticesPoints, 3);
const plainGeometry = new Three.BufferGeometry();
plainGeometry.setAttribute('position', plainPositionAttribute);

const plain = new Three.Mesh(
  plainGeometry,
  new Three.MeshBasicMaterial({
    color: 'green',
    wireframe: true
  })
);

scene.add(plain);

const renderer = new Three.WebGLRenderer({
  canvas,
  alpha: false,
})

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(resolution.x, resolution.y);

const clock = new Three.Clock();

gsap.to(group.position, { duration: 1, delay: 1, x: 2 });

const cursorPosition = { x: 0, y: 0 }

const animationTick = () => {

  // Math.PI = half rotation
  group.rotation.x = Math.PI * clock.getElapsedTime();

  const velocity = 5;

  // taking sinus on one anix and cosinus on another axis gives a point on the circle
  camera.position.x = Math.sin(cursorPosition.x * Math.PI * 2) * velocity;
  camera.position.z = Math.cos(cursorPosition.x * Math.PI * 2) * velocity;
  camera.position.y = cursorPosition.y * velocity;

  camera.lookAt(group.position);

  renderer.render(scene, camera);
  window.requestAnimationFrame(animationTick);
}

animationTick();

window.addEventListener('mousemove', (event) => {
  cursorPosition.x = event.clientX / resolution.x;
  cursorPosition.y = -(event.clientY / resolution.y);
})

window.addEventListener('resize', () => {
  resolution.x = window.innerWidth;
  resolution.y = window.innerHeight;

  camera.aspect = resolution.x / resolution.y;
  camera.updateProjectionMatrix();
  renderer.setSize(resolution.x, resolution.y);
  // useful to keep it here in case someone drags the window from one screen to another
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
})


