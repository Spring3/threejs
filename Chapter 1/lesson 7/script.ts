import * as Three from 'three';
import gsap from 'gsap';
import { ensureCanvasExists } from '../../common';

const canvas = ensureCanvasExists();

const scene = new Three.Scene();

const aspectRatio = window.innerWidth / window.innerHeight;
const camera = new Three.PerspectiveCamera(45, aspectRatio);
scene.add(camera);
camera.translateZ(10);

const axesHelper = new Three.AxesHelper();
scene.add(axesHelper);

const group = new Three.Group();
scene.add(group);

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

const redCube = new Three.Mesh(
  new Three.BoxGeometry(),
  new Three.MeshBasicMaterial({ color: 'red' })
);
group.add(redCube);

const renderer = new Three.WebGLRenderer({
  canvas,
  alpha: false,
})

renderer.setSize(window.innerWidth, window.innerHeight);

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
  cursorPosition.x = event.clientX / window.innerWidth;
  cursorPosition.y = -(event.clientY / window.innerHeight);
})
