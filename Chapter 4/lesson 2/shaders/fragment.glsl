varying vec2 vUv;

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

void main() {
  //
  // float strength = mod(vUv.y / 0.1, 1.0);

  //
  // float strength = mod(vUv.y / 0.1, 1.0);
  // strength = step(0.5, strength);

  // 
  // float strengthY = mod(vUv.y / 0.1, 1.0);
  // strengthY = step(0.8, strengthY);

  // float strengthX = mod(vUv.x / 0.1, 1.0);
  // strengthX = step(0.8, strengthX);

  // float strength = strengthX + strengthY;

  // 
  // float strengthY = mod(vUv.y / 0.1, 1.0);
  // strengthY = step(0.8, strengthY);

  // float strengthX = mod(vUv.x / 0.1, 1.0);
  // strengthX = step(0.5, strengthX);

  // float strength = strengthX * strengthY;

  //
  // float strengthY = mod(vUv.y / 0.1, 1.0);
  // strengthY = step(0.8, strengthY);

  // float strengthX = mod(vUv.x / 0.1, 1.0);
  // strengthX = step(0.5, strengthX);

  // float barX = strengthX * strengthY;

  // float strengthY1 = mod(vUv.y / 0.1, 1.0);
  // strengthY1 = step(0.5, strengthY1);

  // float strengthX1 = mod(vUv.x / 0.1, 1.0);
  // strengthX1 = step(0.8, strengthX1);

  // float barY = strengthX1 * strengthY1;

  // float strength = barX + barY;

  //
  // float strengthY = mod(vUv.y / 0.1 + 0.2, 1.0);
  // strengthY = step(0.8, strengthY);

  // float strengthX = mod(vUv.x / 0.1, 1.0);
  // strengthX = step(0.4, strengthX);

  // float barX = strengthX * strengthY;

  // float strengthY1 = mod(vUv.y / 0.1, 1.0);
  // strengthY1 = step(0.4, strengthY1);

  // float strengthX1 = mod(vUv.x / 0.1 + 0.2, 1.0);
  // strengthX1 = step(0.8, strengthX1);

  // float barY = strengthX1 * strengthY1;

  // float strength = barX + barY;

  //
  // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

  //
  // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

  //
  // float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

  //
  // float strength1 = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
  // float strength2 = 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

  // float strength = strength1 * strength2;

  //
  // float strength = floor(vUv.x / 0.1) / 10.0;

  //
  // float strengthX = floor(vUv.x / 0.1) / 10.0;
  // float strengthY = floor(vUv.y / 0.1) / 10.0;

  // float strength = strengthX * strengthY;

  //
  // float strength = random(vUv.xy);

  //
  // vec2 gridUv = vec2(
  //   floor(vUv.x / 0.1) * 10.0,
  //   floor(vUv.y / 0.1) * 10.0
  // );

  // float strength = random(gridUv);

  //
  // vec2 gridUv = vec2(
  //   floor(vUv.x / 0.1) * 10.0,
  //   floor(vUv.y / 0.1 + vUv.x / 0.5) * 10.0
  // );

  // float strength = random(gridUv);

  //
  // float strength = length(vUv);

  //
  // float strength = distance(vUv, vec2(0.5));

  //
  // float strength = 1.0 - distance(vUv, vec2(0.5));

  //
  // float strength = 0.015 / distance(vUv, vec2(0.5));

  //
  // vec2 lightUv = vec2(
  //   vUv.x * 0.1 + 0.45,
  //   vUv.y * 0.5 + 0.25
  // );

  // float strength = 0.015 / distance(lightUv, vec2(0.5));

  //
  // vec2 lightUvX = vec2(
  //   vUv.x * 0.1 + 0.45,
  //   vUv.y * 0.5 + 0.25
  // );
  // float lightX = 0.015 / distance(lightUvX, vec2(0.5));

  // vec2 lightUvY = vec2(
  //   vUv.y * 0.1 + 0.45,
  //   vUv.x * 0.5 + 0.25
  // );
  // float lightY = 0.015 / distance(lightUvY, vec2(0.5));

  // float strength = lightY * lightX;

  //
  float pi = 3.1415926535897932384626433832795;
  // vec2 rotatedUv = rotate(vUv, pi * 0.25, vec2(0.5));

  // vec2 lightUvX = vec2(
  //   rotatedUv.x * 0.1 + 0.45,
  //   rotatedUv.y * 0.5 + 0.25
  // );
  // float lightX = 0.015 / distance(lightUvX, vec2(0.5));

  // vec2 lightUvY = vec2(
  //   rotatedUv.y * 0.1 + 0.45,
  //   rotatedUv.x * 0.5 + 0.25
  // );
  // float lightY = 0.015 / distance(lightUvY, vec2(0.5));

  // float strength = lightY * lightX;

  // 
  // float strength = step(0.2, distance(vUv, vec2(0.5)));

  //
  // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);

  //
  // float strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

  //
  // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

  //
  // vec2 wavedUv = vec2(
  //   vUv.x,
  //   vUv.y + sin(vUv.x * 30.0) * 0.1
  // );

  // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

  //
  // vec2 wavedUv = vec2(
  //   vUv.x + sin(vUv.y * 30.0) * 0.1,
  //   vUv.y + sin(vUv.x * 30.0) * 0.1
  // );

  // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

  //
  // vec2 wavedUv = vec2(
  //   vUv.x + sin(vUv.y * 150.0) * 0.1,
  //   vUv.y + sin(vUv.x * 150.0) * 0.1
  // );

  // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

  //
  // float strength = atan(vUv.x, vUv.y);

  //
  // float strength = atan(vUv.x - 0.5, vUv.y - 0.5);

  //
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  // angle /= pi * 2.0;
  // angle += 0.5;

  // float strength = angle;

  //
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  // angle /= pi * 2.0;
  // angle += 0.5;
  // angle *= 10.0;

  // float strength = mod(angle, 1.0);

  //
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  // angle /= pi * 2.0;
  // angle += 0.5;

  // float strength = sin(angle * 100.0);

  //
  float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  angle /= pi * 2.0;
  angle += 0.5;

  float radius = 0.15 + sin(angle * 100.0) * 0.02;
  float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));

  //
  // strength = clamp(strength, 0.0, 1.0);
  // vec3 blackColor = vec3(0.0);
  // vec3 uvColor = vec3(vUv, 1.0);
  // vec3 mixedColor = mix(blackColor, uvColor, strength);

  vec3 whiteColor = vec3(1.0, 1.0, 1.0);

  gl_FragColor = vec4(whiteColor * strength, 1.0);
}
