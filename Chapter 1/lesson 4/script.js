import * as Three from 'three';
import { ensureCanvasExists } from '../common';

const canvas = ensureCanvasExists();

const scene = new Three.Scene();

const aspectRatio = window.innerWidth / window.innerHeight;
const camera = new Three.PerspectiveCamera(45, aspectRatio);
scene.add(camera);
camera.translateZ(10);

const geometry = new Three.BoxGeometry();
const material = new Three.MeshBasicMaterial({ color: 'red' });
const cube = new Three.Mesh(geometry, material);
scene.add(cube);

const renderer = new Three.WebGLRenderer({
  canvas,
  alpha: false,
})

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);
