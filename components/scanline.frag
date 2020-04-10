
    precision highp float;
    varying vec2 uv;
    uniform float scannerY;
    uniform float passes;
    uniform sampler2D src;

    // Blend two colors based on blend's alpha
    vec4 blendColors(vec4 base, vec4 blend) {
      return vec4(
        mix(base.rgb, blend.rgb, blend.a),
        1.0
      );
    }

    void main() {
      // Scanner bar's color with alpha drop off
      vec4 scannerColor = vec4(
        0.0,
        0.8 + pow(0.2 - distance(scannerY, uv.y), 512.0),
        0.0,
        0.0 + pow(1.0 - distance(scannerY, uv.y), 128.0)
      );

      // Source color
      vec4 srcColor = texture2D(src, uv);

      vec4 scannedColor = vec4(0.0, 0.3, 0.0, 0.0 + pow(1.0 - distance(scannerY, uv.y), 64.0));

      // Source brightness
      float srcLuma =  dot(srcColor.rgb, vec3(0.299, 0.587, 0.114));

      if (uv.y > scannerY) {
        gl_FragColor = blendColors(srcColor, scannedColor);

        if (srcLuma < min(passes / 10.0, 0.9)) {
          gl_FragColor = vec4(0.0, 1.0, 0.0, 0.8);
        }
      } else {
        gl_FragColor = blendColors(srcColor, scannerColor);

        if (srcLuma < min((passes - 1.0) / 10.0, 0.9)) {
          gl_FragColor = vec4(0.0, 1.0, 0.0, 0.8);
        }
      }

      // if (srcLuma > 0.2) {
      //   gl_FragColor = srcColor;
      // } else {
      //   gl_FragColor = scannedColor;
      // }

      // gl_FragColor = blendColors(srcColor, scannerColor);
    }
