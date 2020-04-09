precision highp float;
varying vec2 uv;
uniform float x;

void main() {
	gl_FragColor = vec4(
    0.0,
    0.0 + pow(1.0 - distance(x, uv.x), 512.0),
    0.0,
    0.0 + pow(1.0 - distance(x, uv.x), 64.0)
  );
}
