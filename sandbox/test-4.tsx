import React, { useState, useEffect, useRef, Ref, useLayoutEffect, RefObject } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Shaders, Node, GLSL } from 'gl-react';
import { Surface } from 'gl-react-expo';
import { Camera } from 'expo-camera';
import { Scanline } from '../components/scanline';
import { width, height, BreakpointValues } from '../utils';

// https://github.com/gre/gl-react/blob/master/examples/expo-gl-react-camera-effects/src/GLCamera.js
const shaders = Shaders.create({
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

export const Test4 = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const camera = useRef<Camera>() as RefObject<Camera>;
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

  const StupidiPhoneHeight = BreakpointValues.isIos ? width * 16 / 10 : height;

  return (
    <View style={styles.container}>
      <Surface style={{ width, height: StupidiPhoneHeight }}>
        <Scanline
          maxThreshold={0.15}
          maxPasses={45}
          speed={200}
          size={StupidiPhoneHeight}
          ref={scanline}
        >
          <Node
            shader={shaders.imageScanline}
            uniforms={{ src: () => camera.current }}
          >
            <Camera
              style={{
                width,
                height: StupidiPhoneHeight
              }}
              ratio={'2:1'}
              type={type}
              ref={camera}
            />
          </Node>
        </Scanline>
      </Surface>
      <View
        style={styles.buttonBar}>
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
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#222'
  },
  buttonBar: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flex: 1,
    backgroundColor: '#0007',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    flex: 0.1,
    alignSelf: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F',
    backgroundColor: '#F0F7',
    padding: 4,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    minWidth: 80,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white'
  }
});
