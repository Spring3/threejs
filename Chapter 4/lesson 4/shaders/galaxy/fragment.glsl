varying vec3 vColor;

void main() {
  float strength = distance(gl_PointCoord, vec2(0.5));

  //
  // strength = 1.0 - step(0.5, strength);

  //
  // strength *= 2.0;
  // strength = 1.0 - strength;

  strength = 1.0 - strength;
  strength = pow(strength, 10.0);

  vec3 color = mix(vec3(0.0), vColor, strength);

  gl_FragColor = vec4(vColor, 1.0);
}
