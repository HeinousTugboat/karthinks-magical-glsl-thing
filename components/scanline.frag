precision highp float;
varying vec2 uv;
uniform float x;
uniform sampler2D src;

vec4 blendColors(vec4 base, vec4 blend) {
  return vec4(
    mix(base.rgb, blend.rgb, blend.a),
    1.0
  );
}

void main() {
  vec4 scannerColor = vec4(
    0.0,
    0.8 + pow(0.2 - distance(x, uv.y), 512.0),
    0.0,
    0.0 + pow(1.0 - distance(x, uv.y), 128.0)
  );

  vec4 srcColor = texture2D(src, uv);

  gl_FragColor = blendColors(srcColor, scannerColor);
}
