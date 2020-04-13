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
    uniform float time;

// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
  {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
  }


    vec4 blendColors(vec4 base, vec4 blend, float pct) {
      return vec4(
        mix(base.rgb, clamp(blend.rgb, vec3(0, 0, 0), vec3(1, 1, 1)), clamp(pct, 0.0, 1.0)),
        1.0
      );
    }

    // Blend two colors based on blend's alpha
    vec4 blendColors(vec4 base, vec4 blend) {
      return blendColors(base, blend, blend.a);
    }

    bool checkColor(vec3 color, float threshold) {
      return all(lessThan(color, vec3(threshold)));
    }

    void main() {
      float octave = 8.;

      float noise = snoise(vec3(gl_FragCoord.xy/octave, time)) * 0.5 + 0.5;
      // Scanner bar's color with alpha drop off
      vec4 scannerColor = vec4(
        0.4 + pow(0.2 - distance(scannerY, uv.y), 512.0),
        0.8 + pow(0.2 - distance(scannerY, uv.y), 512.0),
        0.0,
        // 0.1
        0.0 + pow(1.0 - distance(scannerY, uv.y), 128.0)
      );

      // Source color
      vec4 srcColor = texture2D(src, uv);
      vec4 srcOut = blendColors(srcColor, scannerColor);

      vec4 completeColor = blendColors(srcOut, vec4(0.0, 1.0, 0.0, 1.0), clamp(noise, 0.65, 1.0));

      // Source brightness
      // float srcLuma = dot(srcColor.rgb, vec3(0.299, 0.587, 0.114));
      float preThreshold = min(passes / maxPasses, maxThreshold);
      float postThreshold = min((passes - 1.0) / maxPasses, maxThreshold);

      if (uv.y > scannerY) {
        gl_FragColor = srcOut;
        // gl_FragColor = blendColors(srcOut, scannedColor);

        // if (srcLuma < preThreshold) {
        if (checkColor(srcColor.rgb, preThreshold)) {
          gl_FragColor = completeColor;
        }
      } else {
        // if (srcLuma < postThreshold) {
        if (checkColor(srcColor.rgb, postThreshold)) {
          gl_FragColor = completeColor;
        } else {
          gl_FragColor = srcOut;
        }
      }

      // if (distance(scannerY, uv.y) < 0.2) {
      //   gl_FragColor = scannerColor;
      // }
    }

    `
  }
});

type ScanData = {x: number, passes: number, running: boolean, elapsed: number};

export const ScanlineStatic = forwardRef(({
  children,
  speed = 300,
  size = 300,
  maxPasses = 20,
  maxThreshold = 0.4
}: {children: any, speed?: number, size?: number, maxPasses?: number, maxThreshold?: number}, ref: Ref<ScanlineRef>) => {
  const rAF = React.useRef<number>();
  const [scan, setScan] = React.useState<ScanData>({x: 0, passes: 0, running: false, elapsed: 0});
  const time = React.useRef(Date.now());
  const dT = React.useRef(0);

  const move = (tick: number) => {
    dT.current = tick - time.current;
    time.current = tick;

    setScan(({running, x, passes, elapsed}: ScanData) => {
      if (!running) {
        return {running, x, passes, elapsed: elapsed + dT.current / 1000};
      }
      const newScan: ScanData = {
        x: x - (dT.current / 1000) * (speed / size),
        passes,
        running,
        elapsed: elapsed + dT.current / 1000
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
    reset() { setScan({x: 0, passes: 0, running: false, elapsed: 0}) },
    stop() { setScan({...scan, running: false}) },
    get scan() { return {...scan}}
  }), [scan]);

  return <Node
    shader={shaders.scanline}
    uniforms={{scannerY: scan.x, passes: scan.passes, src: children, maxPasses, maxThreshold, time: scan.elapsed}}
  />;
});

export interface ScanlineRef {
  start(): void;
  reset(): void;
  stop(): void;
  scan: ScanData;
}
