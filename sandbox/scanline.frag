precision mediump float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
float rx;
vec2 uv;
vec2 st;
vec2 mx;

const float TAU = 1.570796326794897;
const float PI = 3.141592653589793;
const float TWO_PI = 6.283185307179586;

vec2 coord(in vec2 p) {
	p = p / u_resolution.xy;
	// correct aspect ratio
	if (u_resolution.x > u_resolution.y) {
		p.x *= u_resolution.x / u_resolution.y;
		p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
	} else {
		p.y *= u_resolution.y / u_resolution.x;
		p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
	}
	// centering
	p -= 0.5;
	p *= vec2(-1.0, 1.0);
	return p;
}

void setCoords() {
  rx = 1.0 / min(u_resolution.x, u_resolution.y);
  uv = gl_FragCoord.xy / u_resolution.xy;
  st = coord(gl_FragCoord.xy);
  mx = coord(u_mouse);

}

void main() {
	setCoords();

  gl_FragColor = vec4(
    0,
    0.0 + pow(1.0 - distance(mx.x, uv.x), 512.0),
    0,
    0.0 + pow(1.0 - distance(mx.x, uv.x), 64.0)
  );
}

