precision highp float;
varying vec2 uv;
uniform sampler2D src;

void main() {
  // Insert color transforms here
  gl_FragColor = texture2D(src, uv);
}
