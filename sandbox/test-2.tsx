import React, { Component } from 'react';
import { Shaders, Node, GLSL as glsl } from 'gl-react';
import { Surface } from 'gl-react-expo';
import test2 from './test-2.frag';

const shaders = Shaders.create({
  glslCanvasExample: {
    frag: glsl`${test2}`
  }
});

export class Test2 extends Component {
  render() {
    return (
      <Surface style={{width: '100%', height: '100%'}}>
        <Node shader={shaders.glslCanvasExample} uniforms={{u_resolution: {x: 100, y: 100}, u_mouse: {x: 50, y: 50}, u_time: Math.random()}} />
      </Surface>
    );
  }
}
