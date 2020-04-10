import React, { useState, useEffect, useRef, Ref } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Shaders, Node, GLSL } from 'gl-react';
import { Surface } from 'gl-react-expo';
import { Camera } from 'expo-camera';
import test1 from './test-1.frag';
import { Scanline } from '../components/scanline';
import imageFragment from '../components/image.frag';

const shaders = Shaders.create({
  helloGL: {
    frag: GLSL`
precision highp float;
varying vec2 uv;

void main() {
  gl_FragColor = vec4(uv.x, uv.y, 0.5, 1.0);
}
`
},
imageScanline: {
  frag: GLSL`
  precision highp float;
  varying vec2 uv;
  uniform sampler2D src;

  void main() {
    // Insert color transforms here
    gl_FragColor = texture2D(src, uv);
  }
  `
},
});
// export class Test4 extends Component {
//   render() {
//     return (
//       <Surface style={{width: 300, height: 300}}>
//         <Node shader={shaders.helloGL} />
//       </Surface>
//     );
// // Surface creates the canvas, an area of pixels where you can draw.
// // Node instanciates a "shader program" with the fragment shader defined above.
//   }
// }

export const Test4 = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const camera = useRef<Camera>();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1, width: '100%' }}>
      <Surface style={{width: 300, height: 300}}>
        <Scanline speed={100} size={300}>
        <Node
        shader={shaders.imageScanline}
        blendFunc={{ src: "one", dst: "one minus src alpha" } as any}
        uniforms={{src: camera.current}}
      >
        <Camera
          style={{
            width: 400,
            height: 533.33
          }}
          ratio="4:3"
          type={type}
          ref={(c: Camera) => camera.current = c}
        />
      </Node>
        </Scanline>
      </Surface>
    </View>
  );
}
