import glsl from 'vite-plugin-glsl';

/** @type {import('vite').UserConfig} */
export default {
  publicDir: '../../public',
  plugins: [
    glsl()
  ]
}
