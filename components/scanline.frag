
    precision highp float;
    varying vec2 uv;
    uniform float scannerY;
    uniform float passes;
    uniform sampler2D src;
    uniform float maxPasses;
    uniform float maxThreshold;

    // Blend two colors based on blend's alpha
    vec4 blendColors(vec4 base, vec4 blend) {
      return vec4(
        mix(base.rgb, clamp(blend.rgb, vec3(0, 0, 0), vec3(1, 1, 1)), clamp(blend.a, 0.0, 1.0)),
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
      vec4 completeColor = vec4(0.0, 1.0, 0.0, 0.8);

      // Source brightness
      float srcLuma = dot(srcColor.rgb, vec3(0.299, 0.587, 0.114));
      float preThreshold = min(passes / maxPasses, maxThreshold);
      float postThreshold = min((passes - 1.0) / maxPasses, maxThreshold);

      if (uv.y > scannerY) {
        gl_FragColor = blendColors(srcColor, scannedColor);

        if (srcLuma < preThreshold) {
          gl_FragColor = completeColor;
        }
      } else {
        if (srcLuma < postThreshold) {
          gl_FragColor = completeColor;
        } else {
          gl_FragColor = srcColor;
        }
      }
    }
