import React, { useState, useEffect, useRef, Ref } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Shaders, Node, GLSL } from 'gl-react';
import { Surface } from 'gl-react-expo';
import { Camera } from 'expo-camera';
import test1 from './test-1.frag';
import { Scanline } from '../components/scanline';
import imageFragment from '../components/image.frag';

// https://github.com/gre/gl-react/blob/master/examples/expo-gl-react-camera-effects/src/GLCamera.js
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
    gl_FragColor = texture2D(src, vec2(1.0 - uv.x, 1.0 - uv.y));
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
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const camera = useRef<Camera>();
  const scanline = useRef<any>();

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
      <Surface style={{ width: 400, height: 533.33 }}>
        <Scanline speed={200} size={533.33} ref={scanline}>
          <Node
            shader={shaders.imageScanline}

            uniforms={{ src: camera.current }}
          >
            <Camera
              style={{
                width: 400,
                height: 533.33
              }}
              ratio="4:3"
              type={type}
              ref={(c: Camera) => camera.current = c}
            >

            </Camera>
          </Node>
        </Scanline>
      </Surface>
      <View
        style={{
          flex: 1,
          backgroundColor: '#F0F3',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}>
          <Text style={styles.label}>Flip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => scanline.current.reset()}
        >
          <Text style={styles.label}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => scanline.current.start()}
        >
          <Text style={styles.label}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => scanline.current.stop()}
        >
          <Text style={styles.label}>Stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 0.1,
    alignSelf: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F',
    backgroundColor: '#F0F3',
    padding: 4,
    paddingHorizontal: 8,
    minWidth: 80,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white'
  }
});
