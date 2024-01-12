uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

attribute float aScale;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.y += sin(uTime + modelPosition.x * 100.0) * aScale * 0.1;
  modelPosition.x += sin(uTime + modelPosition.y * 10.0) * aScale * 0.1;
  modelPosition.z += sin(uTime + modelPosition.y * 10.0) * aScale * 0.1;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  float sizeScale = clamp(sin(uTime) * aScale, 0.5, 1.0);

  gl_Position = projectedPosition;
  gl_PointSize = (uSize * aScale * uPixelRatio * sizeScale) * (1.0 / -viewPosition.z);
}
