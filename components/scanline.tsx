import React, { ReactChildren } from 'react';
import { Shaders, Node, GLSL } from 'gl-react';
import scanline from './scanline.frag';

const shaders = Shaders.create({
  scanline: {
    frag: GLSL`${scanline}`
  }
});

const PADDING = 0;

export const Scanline = ({children, speed = 300, size = 300}: {children: any, speed?: number, size?: number}) => {
  const rAF = React.useRef<number>();
  const [scan, setScan] = React.useState({x: 0, dir: 1});

  const time = React.useRef(Date.now());
  const dT = React.useRef(0);

  const move = (tick: number) => {
    dT.current = tick - time.current;
    time.current = tick;

    setScan(({x, dir}) => {
      const newScan = {
        x: x + dir * (dT.current / 1000) * (speed / size),
        dir
      }

      if (newScan.x < PADDING) {
        newScan.dir = 1;
        newScan.x = PADDING;
      }

      if (newScan.x > 1 - PADDING) {
        newScan.dir = -1;
        newScan.x = 1 - PADDING;
      }

      newScan.x = newScan.x ?? 0.5;

      return newScan;
    });

      rAF.current = requestAnimationFrame(move);
  };

  React.useEffect(() => {
    rAF.current = requestAnimationFrame(move);
    return () => rAF.current ? cancelAnimationFrame(rAF.current) : undefined;
  }, []);

  return <Node
    shader={shaders.scanline}
    uniforms={{x: scan.x, src: children}}
  />;
}
