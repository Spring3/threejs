import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader';
import { GUI } from 'lil-gui'
import { ensureCanvasExists } from '../../common'

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
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new Three.CubeTextureLoader()
const textureLoader = new Three.TextureLoader()

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof Three.Mesh && child.material instanceof Three.MeshStandardMaterial)
        {
            child.material.envMapIntensity = 2.5
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/environmentMaps/0/px.png',
    '/environmentMaps/0/nx.png',
    '/environmentMaps/0/py.png',
    '/environmentMaps/0/ny.png',
    '/environmentMaps/0/pz.png',
    '/environmentMaps/0/nz.png'
])

scene.background = environmentMap
scene.environment = environmentMap

/**
 * Models
 */
gltfLoader.load(
    '/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)

/**
 * Lights
 */
const directionalLight = new Three.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)

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

    effectComposer.setSize(sizes.width, sizes.height)
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new Three.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new Three.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = Three.PCFShadowMap
renderer.toneMapping = Three.ReinhardToneMapping
renderer.toneMappingExposure = 1.5
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const renderTarget = new Three.WebGLRenderTarget(sizes.width, sizes.height, {
  samples: renderer.getPixelRatio() === 1 ? 2 : 1
});

const effectComposer = new EffectComposer(renderer, renderTarget);

effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
effectComposer.setSize(sizes.width, sizes.height);

const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

const dotScreenPass = new DotScreenPass();
dotScreenPass.enabled = false;
effectComposer.addPass(dotScreenPass);

const glitchPass = new GlitchPass();
glitchPass.enabled = false;
effectComposer.addPass(glitchPass);

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.enabled = false;
effectComposer.addPass(rgbShiftPass);

const gammaCorrection = new ShaderPass(GammaCorrectionShader)
effectComposer.addPass(gammaCorrection);

const unrealBloomPass = new UnrealBloomPass(new Three.Vector2(sizes.width, sizes.height), 0.3, 1, 0.6);
unrealBloomPass.enabled = false;
effectComposer.addPass(unrealBloomPass);

const TintPass = {
  uniforms: {
    tDiffuse: { value: null },
    uTint: { value: null }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
      vUv = uv;
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec3 uTint;

    varying vec2 vUv;

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      color.rgb += uTint;
      gl_FragColor = color;
    }
  `
};

const tintPass = new ShaderPass(TintPass);
tintPass.material.uniforms.uTint.value = new Three.Vector3(0.1, 0.1, 0.1);
effectComposer.addPass(tintPass);

gui.add(tintPass.material.uniforms.uTint.value, 'x').min(-1).max(1).step(0.001).name('red');
gui.add(tintPass.material.uniforms.uTint.value, 'y').min(-1).max(1).step(0.001).name('green');
gui.add(tintPass.material.uniforms.uTint.value, 'z').min(-1).max(1).step(0.001).name('blue');

// const DisplacementPass = {
//   uniforms: {
//     tDiffuse: { value: null },
//     uTime: { value: null }
//   },
//   vertexShader: `
//     varying vec2 vUv;
//     void main() {
//       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
//       vUv = uv;
//     }
//   `,
//   fragmentShader: `
//     uniform sampler2D tDiffuse;
//     uniform float uTime;

//     varying vec2 vUv;


//     void main() {
//       vec2 displacementUv = vec2(
//         vUv.x,
//         vUv.y + sin(vUv.x * 10.0 + uTime) * 0.1
//       );

//       gl_FragColor = texture2D(tDiffuse, displacementUv);
//     }
//   `
// };

const DisplacementPass = {
  uniforms: {
    tDiffuse: { value: null },
    uNormalMap: { value: null }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
      vUv = uv;
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform sampler2D uNormalMap;

    varying vec2 vUv;

    void main() {
      vec3 normalColor = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
      vec2 displacementUv = vUv + normalColor.xy * 0.1;

      vec4 color = texture2D(tDiffuse, displacementUv);

      vec3 lightDirection = normalize(vec3(-1.0, 1.0, 0.0));
      float lightness = dot(normalColor, lightDirection);
      color.rgb += lightness * 2.0;

      gl_FragColor = color;
    }
  `
};

const displacementPass = new ShaderPass(DisplacementPass);
displacementPass.material.uniforms.uNormalMap.value = textureLoader.load('/textures/interfaceNormalMap.png');
effectComposer.addPass(displacementPass);

if (renderer.getPixelRatio() === 1 || !renderer.capabilities.isWebGL2) {
  const smaaPass = new SMAAPass(sizes.width, sizes.height);
  effectComposer.addPass(smaaPass);
}

/**
 * Animate
 */
const clock = new Three.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // displacementPass.material.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    // renderer.render(scene, camera)
    effectComposer.render();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
