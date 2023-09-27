import * as Three from 'three'
import { GUI } from 'lil-gui'
import gsap from 'gsap';
import { ensureCanvasExists } from '../../common'

const textureLoader = new Three.TextureLoader();

const gradientTexture = textureLoader.load('textures/gradients/3.jpg');
gradientTexture.magFilter = Three.NearestFilter;

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor').onChange(() => {
        material.color.set(parameters.materialColor);
        particlesMaterial.color.set(parameters.materialColor);
    })

/**
 * Base
 */
// Canvas
const canvas = ensureCanvasExists();

// Scene
const scene = new Three.Scene()

const material = new Three.MeshToonMaterial({ color: parameters.materialColor, gradientMap: gradientTexture });

const objectsDistance = 2;
const mesh1 = new Three.Mesh(
    new Three.TorusGeometry(1, 0.4, 16, 60),
    material
)

mesh1.position.y = 0;
mesh1.position.x = 2;
mesh1.scale.set(.5, .5, .5);

const mesh2 = new Three.Mesh(
    new Three.ConeGeometry(1, 2, 32),
    material
)

mesh2.visible = true;
mesh2.position.x = -2;
mesh2.position.y = -objectsDistance

const mesh3 = new Three.Mesh(
    new Three.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

mesh3.position.x = 2;
mesh3.position.y = -objectsDistance * 2;
mesh3.scale.set(.5, .5, .5);

scene.add(mesh1, mesh2, mesh3);

const directionalLight = new Three.DirectionalLight('white', 2);
directionalLight.position.set(1, 1, 0);

scene.add(directionalLight);

const sectionMeshes = [mesh1, mesh2, mesh3];

const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 10;
    positions[i3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length;
    positions[i3 + 2] = (Math.random() - 0.5) * 10;
}

const particlesGeometry = new Three.BufferGeometry();
particlesGeometry.setAttribute('position', new Three.BufferAttribute(positions, 3));

const particlesMaterial = new Three.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
});

const particles = new Three.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

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

const cameraGroup = new Three.Group();
scene.add(cameraGroup);

// Base camera
const camera = new Three.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new Three.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;

    const newSection = Math.round(scrollY / sizes.height);

    if (newSection !== currentSection) {
        currentSection = newSection;

        gsap.to(
            sectionMeshes[currentSection].rotation, { duration: 1.5, ease: 'power2.inOut', x: '+=6', y: '+=3' }
        )
    }
})

const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (e) => {
    cursor.x = e.clientX / sizes.width - 0.5;
    cursor.y = e.clientY / sizes.height - 0.5;
})

/**
 * Animate
 */
const clock = new Three.Clock()
let previousTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    camera.position.y = - scrollY / sizes.height * objectsDistance;
    
    const parallaxX = cursor.x;
    const parallaxY = - cursor.y;

    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 2 * deltaTime;
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 2 * deltaTime;

    for(const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1;
        mesh.rotation.y += deltaTime * 0.12;
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
