import React, { Component } from 'react';
import { Shaders, Node, GLSL } from 'gl-react';
import { Surface } from 'gl-react-expo';
import scanline from './scanline-app.frag';
import { width, height, clampVec } from '../utils';
import { View, Text } from 'react-native';

const shaders = Shaders.create({
  scanline: {
    frag: GLSL`${scanline}`
  }
});

const PADDING = 5 / width;

export const FirstAttempt = () => {
  const rAF = React.useRef<number>();
  const [scan, setScan] = React.useState({x: 0, dir: 1});
  const [moving, keepMoving] = React.useState(true);

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
      <View>
        <Text>{JSON.stringify(scan, null, 2)}</Text>
        <Surface style={{width: 300, height: 300}}>
          <Node shader={shaders.scanline} uniforms={{x: scan.x}}/>
        </Surface>
      </View>
  );
}
