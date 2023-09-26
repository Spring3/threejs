import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'lil-gui'
import { ensureCanvasExists } from '../../common';

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = ensureCanvasExists();

// Scene
const scene = new Three.Scene()

/**
 * Textures
 */
const textureLoader = new Three.TextureLoader()

const particleCircleTexture = textureLoader.load('/textures/particles/2.png');

const particlesGeometry = new Three.SphereGeometry(1, 32, 32);
const particlesMaterial = new Three.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
    transparent: true,
    alphaMap: particleCircleTexture,
    // alphaTest: 0.001,
    // depthTest: false,
    depthWrite: false,
    blending: Three.AdditiveBlending,
    vertexColors: true,
})

const particles = new Three.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

const customParticlesGeometry = new Three.BufferGeometry();
const particleCount = 50000;

const verticesPoints = new Float32Array(particleCount * 3);
const rgbColors = new Float32Array(particleCount * 3);

for (let i = 0; i < verticesPoints.length; i++) {
    verticesPoints[i] = (Math.random() - 0.5) * 10;
    rgbColors[i] = Math.random();
}

customParticlesGeometry.setAttribute('position', new Three.BufferAttribute(verticesPoints, 3));
customParticlesGeometry.setAttribute('color', new Three.BufferAttribute(rgbColors, 3));

const customParticles = new Three.Points(customParticlesGeometry, particlesMaterial);
scene.add(customParticles);


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

    customParticles.rotation.y = elapsedTime * 0.01;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
