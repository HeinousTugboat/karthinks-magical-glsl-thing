import React, { ReactChildren, forwardRef, Ref } from 'react';
import { Shaders, Node, GLSL } from 'gl-react';
import scanline from './scanline.frag';

const shaders = Shaders.create({
  scanline: {
    frag: GLSL`

    precision highp float;
    varying vec2 uv;
    uniform sampler2D src;
    uniform float scannerY;
    uniform float passes;
    uniform float maxPasses;
    uniform float maxThreshold;

    // Blend two colors based on blend's alpha
    vec4 blendColors(vec4 base, vec4 blend) {
      return vec4(
        mix(base.rgb, clamp(blend.rgb, vec3(0, 0, 0), vec3(1, 1, 1)), clamp(blend.a, 0.0, 1.0)),
        1.0
      );
    }

    bool checkColor(vec3 color, float threshold) {
      return all(lessThan(color, vec3(threshold)));
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
      // float srcLuma = dot(srcColor.rgb, vec3(0.299, 0.587, 0.114));
      float preThreshold = min(passes / maxPasses, maxThreshold);
      float postThreshold = min((passes - 1.0) / maxPasses, maxThreshold);

      if (uv.y > scannerY) {
        gl_FragColor = blendColors(srcColor, scannedColor);

        // if (srcLuma < preThreshold) {
        if (checkColor(srcColor.rgb, preThreshold)) {
          gl_FragColor = completeColor;
        }
      } else {
        // if (srcLuma < postThreshold) {
        if (checkColor(srcColor.rgb, postThreshold)) {
          gl_FragColor = completeColor;
        } else {
          gl_FragColor = srcColor;
        }
      }
    }

    `
  }
});

type scanData = {x: number, passes: number, running: boolean};

export const Scanline = forwardRef(({
  children,
  speed = 300,
  size = 300,
  maxPasses = 20,
  maxThreshold = 0.4
}: {children: any, speed?: number, size?: number, maxPasses?: number, maxThreshold?: number}, ref: Ref<any>) => {
  const rAF = React.useRef<number>();
  const [scan, setScan] = React.useState<scanData>({x: 0, passes: 0, running: false});
  const time = React.useRef(Date.now());
  const dT = React.useRef(0);

  const move = (tick: number) => {
    dT.current = tick - time.current;
    time.current = tick;

    setScan(({running, x, passes}: scanData) => {
      if (!running) {
        return {running, x, passes};
      }
      const newScan: scanData = {
        x: x - (dT.current / 1000) * (speed / size),
        passes,
        running
      }

      if (newScan.x < 0) {
        newScan.x = 1;
        newScan.passes = passes + 1;
      }

      if (newScan.x > 1) {
        newScan.x = 1;
      }

      if (newScan.passes > maxPasses) {
        newScan.running = false;
      }

      return newScan;
    });

    rAF.current = requestAnimationFrame(move);
  };

  React.useEffect(() => {
    rAF.current = requestAnimationFrame(move);
    return () => rAF.current ? cancelAnimationFrame(rAF.current) : undefined;
  }, []);

  React.useImperativeHandle(ref, () => ({
    start() { setScan({...scan, running: true}) },
    reset() { setScan({x: 0, passes: 0, running: false}) },
    stop() { setScan({...scan, running: false}) },
    get scan() { return {...scan}}
  }), [scan]);

  return <Node
    shader={shaders.scanline}
    uniforms={{scannerY: scan.x, passes: scan.passes, src: children, maxPasses, maxThreshold}}
  />;
});
