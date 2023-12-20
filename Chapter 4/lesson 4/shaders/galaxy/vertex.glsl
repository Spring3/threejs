uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 aRandomness;
varying vec3 vColor;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
  float distanceToCenter = length(modelPosition.xz);

  float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
  float angle = atan(modelPosition.x, modelPosition.z) + angleOffset;

  modelPosition.x = cos(angle) * distanceToCenter;
  modelPosition.z = sin(angle) * distanceToCenter;

  modelPosition.xyz += aRandomness;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;
  gl_PointSize = uSize * aScale * (1.0 / -viewPosition.z);
  vColor = color;
}
