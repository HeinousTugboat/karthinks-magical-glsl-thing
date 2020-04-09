import React, { Component } from 'react';
import { Shaders, Node, GLSL as glsl } from 'gl-react';
import { Surface } from 'gl-react-expo';
import scanline from './scanline-app.frag';
import { width, height } from '../utils';
import { View, Text } from 'react-native';

const shaders = Shaders.create({
  scanline: {
    frag: glsl`${scanline}`
  }
});

const PADDING = 0;

export const FirstAttempt = () => {
  const rAF = React.useRef<number>();
  const [scan, setScan] = React.useState({x: 0, dir: 1});
  const [moving] = React.useState(true);

  const time = React.useRef(Date.now());
  const dT = React.useRef(0);

  const move = (tick: number) => {
    dT.current = tick - time.current;
    time.current = tick;

    setScan(({x, dir}) => {
      const newScan = {
        x: x + dir / (4.5 * dT.current),
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

    if (moving) {
      rAF.current = requestAnimationFrame(move);
    }
  };

  React.useEffect(() => {
    rAF.current = requestAnimationFrame(move);
    return () => rAF.current ? cancelAnimationFrame(rAF.current) : undefined;
  }, []);

    return (
      <View style={{width: '100%', height: '100%'}}>
        <Surface style={{width: '100%', height: '100%'}}>
          <Node shader={shaders.scanline} uniforms={{x: scan.x}}/>
        </Surface>
      </View>
  );
}
