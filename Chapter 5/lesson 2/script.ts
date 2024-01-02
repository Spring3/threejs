import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ensureCanvasExists } from '../../common'
import Stats from 'stats.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/**
 * Base
 */
// Canvas
const canvas = ensureCanvasExists();

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// Scene
const scene = new Three.Scene()

/**
 * Textures
 */
const textureLoader = new Three.TextureLoader()
const displacementTexture = textureLoader.load('/textures/displacementMap.png')

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
camera.position.set(2, 2, 6)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new Three.WebGLRenderer({
    canvas: canvas,
    powerPreference: 'high-performance',
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = Three.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)

/**
 * Test meshes
 */
const cube = new Three.Mesh(
    new Three.BoxGeometry(2, 2, 2),
    new Three.MeshStandardMaterial()
)
cube.castShadow = true
cube.receiveShadow = true
cube.position.set(- 5, 0, 0)
scene.add(cube)

const torusKnot = new Three.Mesh(
    new Three.TorusKnotGeometry(1, 0.4, 128, 32),
    new Three.MeshStandardMaterial()
)
torusKnot.castShadow = true
torusKnot.receiveShadow = true
scene.add(torusKnot)

const sphere = new Three.Mesh(
    new Three.SphereGeometry(1, 32, 32),
    new Three.MeshStandardMaterial()
)
sphere.position.set(5, 0, 0)
sphere.castShadow = true
sphere.receiveShadow = true
scene.add(sphere)

const floor = new Three.Mesh(
    new Three.PlaneGeometry(10, 10),
    new Three.MeshStandardMaterial()
)
floor.position.set(0, - 2, 0)
floor.rotation.x = - Math.PI * 0.5
floor.castShadow = true
floor.receiveShadow = true
scene.add(floor)

/**
 * Lights
 */
const directionalLight = new Three.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, 2.25)
scene.add(directionalLight)

/**
 * Animate
 */
const clock = new Three.Clock()

const tick = () =>
{
    stats.begin();
    const elapsedTime = clock.getElapsedTime()

    // Update test mesh
    torusKnot.rotation.y = elapsedTime * 0.1

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
    stats.end();
}

tick()

/**
 * Tips
 */

// // Tip 4
// console.log(renderer.info)

// // Tip 6
// scene.remove(cube)
// cube.geometry.dispose()
// cube.material.dispose()

// // Tip 10
// directionalLight.shadow.camera.top = 3
// directionalLight.shadow.camera.right = 6
// directionalLight.shadow.camera.left = - 6
// directionalLight.shadow.camera.bottom = - 3
// directionalLight.shadow.camera.far = 10
// directionalLight.shadow.mapSize.set(1024, 1024)

// const cameraHelper = new Three.CameraHelper(directionalLight.shadow.camera)
// scene.add(cameraHelper)

// // Tip 11
// cube.castShadow = true
// cube.receiveShadow = false

// torusKnot.castShadow = true
// torusKnot.receiveShadow = false

// sphere.castShadow = true
// sphere.receiveShadow = false

// floor.castShadow = false
// floor.receiveShadow = true

// // Tip 12
// renderer.shadowMap.autoUpdate = false
// renderer.shadowMap.needsUpdate = true

// Tip 18
// const geometries: Array<Three.BufferGeometry> = []

// const material = new Three.MeshNormalMaterial()
// for(let i = 0; i < 50; i++)
// {
//     const geometry = new Three.BoxGeometry(0.5, 0.5, 0.5)
//     geometry.translate(
//       (Math.random() - 0.5) * 10,
//       (Math.random() - 0.5) * 10,
//       (Math.random() - 0.5) * 10
//     )

//     geometries.push(geometry);

//     // const mesh = new Three.Mesh(geometry, material)
//     // mesh.position.x = (Math.random() - 0.5) * 10
//     // mesh.position.y = (Math.random() - 0.5) * 10
//     // mesh.position.z = (Math.random() - 0.5) * 10
//     // mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
//     // mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2

//     // scene.add(mesh)
// }

// const mergedGeometries = mergeGeometries(geometries)

// const mesh = new Three.Mesh(mergedGeometries, material);

// scene.add(mesh);

// Tip 22
// const geometry = new Three.BoxGeometry(0.5, 0.5, 0.5)

// const material = new Three.MeshNormalMaterial()

// const mesh = new Three.InstancedMesh(geometry, material, 50);
// mesh.instanceMatrix.setUsage(Three.DynamicDrawUsage);

// scene.add(mesh)
    
// for(let i = 0; i < 50; i++)
// {
//   const position = new Three.Vector3(
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10,
//   )

//   const quaternion = new Three.Quaternion();
//   quaternion.setFromEuler(new Three.Euler(
//     (Math.random() - 0.5) * Math.PI * 2,
//     (Math.random() - 0.5) * Math.PI * 2,
//     0
//   ));

//   const matrix = new Three.Matrix4();

//   matrix.makeRotationFromQuaternion(quaternion);
//   matrix.setPosition(position);

//   mesh.setMatrixAt(i, matrix);

//     // const mesh = new Three.Mesh(geometry, material)
//     // mesh.position.x = (Math.random() - 0.5) * 10
//     // mesh.position.y = (Math.random() - 0.5) * 10
//     // mesh.position.z = (Math.random() - 0.5) * 10
//     // mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
//     // mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2
// }

// // Tip 29
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Tip 31, 32, 34 and 35
const shaderGeometry = new Three.PlaneGeometry(10, 10, 256, 256)

const shaderMaterial = new Three.ShaderMaterial({
    uniforms:
    {
        uDisplacementTexture: { value: displacementTexture },
        uDisplacementStrength: { value: 1.5 }
    },
    vertexShader: `
        uniform sampler2D uDisplacementTexture;
        uniform float uDisplacementStrength;

        varying vec2 vUv;
        varying vec3 vColor;

        void main()
        {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);

            float elevation = texture2D(uDisplacementTexture, uv).r;
            elevation = max(elevation, 0.5);

            modelPosition.y += elevation * uDisplacementStrength;

            gl_Position = projectionMatrix * viewMatrix * modelPosition;

            // Color
            float colorElevation = max(elevation, 0.25);
            vec3 depthColor = vec3(1.0, 0.1, 0.1);
            vec3 surfaceColor = vec3(0.1, 0.0, 0.5);
            vec3 finalColor = mix(depthColor, surfaceColor, colorElevation);

            vUv = uv;
            vColor = finalColor;
        }
    `,
    fragmentShader: `
        uniform sampler2D uDisplacementTexture;

        varying vec3 vColor;

        void main()
        {
            gl_FragColor = vec4(vColor, 1.0);
        }
    `
})

const shaderMesh = new Three.Mesh(shaderGeometry, shaderMaterial)
shaderMesh.rotation.x = - Math.PI * 0.5
scene.add(shaderMesh)
