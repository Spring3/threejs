import * as Three from 'three';
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
renderer.render(scene, camera);
 