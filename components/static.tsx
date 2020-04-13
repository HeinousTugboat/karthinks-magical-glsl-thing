import React, { ReactChildren, forwardRef, Ref } from 'react';
import { Shaders, Node, GLSL } from 'gl-react';
import staticFrag from './static.frag';

const shaders = Shaders.create({
  static: {
    frag: GLSL`
    // 67
    ${staticFrag}
    `
  }
});
export const Static = ({ children, octave, offset, color = [0, 0, 0, 0] }: {
  children: any,
  octave: number,
  offset: number,
  color?: [number, number, number, number],
}) => {
  return <Node
    shader={shaders.static}
    uniforms={{ src: children, octave, offset, color }}
  />;
}
