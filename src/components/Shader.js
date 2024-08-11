export const vertex = `
varying vec2 vUv;
uniform vec2 uDelta;
float PI = 3.141592653589793238;

void main() {
   vUv = uv;
   vec3 newPosition = position;
   newPosition.x += sin(uv.y * PI) * uDelta.x * 0.0005;
   newPosition.y += sin(uv.x * PI) * uDelta.y * 0.0005;
   gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;


// export const fragment = `
// varying vec2 vUv;
// uniform sampler2D uTexture;

// void main() {
//   vec4 texture = texture2D(uTexture, vUv);
//   gl_FragColor = texture;
// }
// `;

// gl_FragColor = vec4(1., 0., 0., 1.); 

export const fragment = `
varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uOpacity;  // Control the opacity of the final color
uniform vec2 uDelta;  // Control the distortion intensity

void main() {
  // Apply symmetrical offsets to the UV coordinates for RGB channels
  vec2 redUv = vUv + vec2(-uDelta.x * 0.0005, -uDelta.y * 0.0005);  // Balanced shift for red channel
  vec2 greenUv = vUv + vec2(uDelta.x * 0.0005, 0.0);  // Balanced shift for green channel
  vec2 blueUv = vUv + vec2(0.0, uDelta.y * 0.0005);  // Balanced shift for blue channel

  // Sample the texture at the shifted UV coordinates
  vec4 red = texture2D(uTexture, redUv);
  vec4 green = texture2D(uTexture, greenUv);
  vec4 blue = texture2D(uTexture, blueUv);

  // Combine the channels into a final color
  vec4 color = vec4(red.r, green.g, blue.b, 1.0);

  // Apply the uOpacity uniform to the final color
  gl_FragColor = vec4(color.rgb, color.a * uOpacity);
}
`;



// gl_FragColor = vec4(1., 0., 0., 1.);