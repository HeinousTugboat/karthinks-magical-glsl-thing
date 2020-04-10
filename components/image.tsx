import React from 'react';
import { Shaders, Node, GLSL } from 'gl-react';
import imageFragment from './image.frag';
import { ImageSourcePropType } from 'react-native';


const shaders = Shaders.create({
  imageScanline: {
    frag: GLSL`${imageFragment}`
  },
});

export const Image = ({src}: {src: ImageSourcePropType}) => {
    return <Node shader={shaders.imageScanline} uniforms={{src}} />
}
