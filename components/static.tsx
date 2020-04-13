import React, { ReactChildren, forwardRef, Ref } from 'react';
import { Shaders, Node, GLSL } from 'gl-react';
import staticFrag from './static.frag';

const shaders = Shaders.create({
  static: {
    frag: GLSL`
    // 54
    ${staticFrag}
    `
  }
});
export const Static = ({ children, octave, offset }: {
  children: any,
  octave: number,
  offset: number
}) => {
  return <Node
    shader={shaders.static}
    uniforms={{ src: children, octave, offset }}
  />;
}
