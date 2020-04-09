precision highp float;
varying vec2 uv;
uniform float x;

void main() {
	gl_FragColor = vec4(
        0.0,
    0.8 + pow(0.2 - distance(x, uv.y), 512.0),
    0.0,
    0.0 + pow(1.0 - distance(x, uv.y), 128.0)
  );
}
