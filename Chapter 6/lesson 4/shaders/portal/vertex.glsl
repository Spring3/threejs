varying vec2 vUv;

uniform float uTime;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  gl_PointSize = uTime * (1.0 / -viewPosition.z) * 100.0;
  vUv = uv;
}
