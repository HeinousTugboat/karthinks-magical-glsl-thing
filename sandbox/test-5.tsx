import React, { Component } from 'react';
import { Shaders, Node, GLSL } from 'gl-react';
import { Surface } from 'gl-react-expo';
import test5 from './test-5.frag';
import { Text } from 'react-native';

import { width, height, clampVec } from '../utils';
import { Static } from '../components/static';

const shaders = Shaders.create({
  glslCanvasExample: {
    frag: GLSL`
    // 54
    ${test5}
    `
  },
  blank: {
    frag: GLSL`
    void main() {
      gl_FragColor = vec4(1.0);
    }`
  }
});

export const Test5 = () => {
  const [coord, setCoord] = React.useState({ y: 0 });
  const [moving, keepMoving] = React.useState(true);

  const time = React.useRef(Date.now());
  const dT = React.useRef(0);

  const move = (tick: number) => {
    dT.current = tick - time.current;
    time.current = tick;

    setCoord(({ y }) => {
      return {
        y: y + dT.current / 1000
      }
    });

    if (moving) {
      requestAnimationFrame(move);
    }
  };

  React.useEffect(() => { requestAnimationFrame(move) }, []);

  return (
    <Surface style={{ width: '100%', height: '100%' }}>
      <Static offset={coord.y} octave={32}>
      <Static offset={coord.y} octave={16}>
      <Static offset={coord.y} octave={8}>
        <Node shader={shaders.blank}/>
        </Static>
        </Static>
      </Static>
    </Surface>
  );
}
