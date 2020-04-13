import React, { useState, useEffect, useRef, Ref, useLayoutEffect, RefObject } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Shaders, Node, GLSL } from 'gl-react';
import { Surface } from 'gl-react-expo';
import { Camera } from 'expo-camera';
import { ScanlineStatic as Scanline, ScanlineRef } from '../components/scanline-static';
import { width, height, BreakpointValues } from '../utils';
import { ButtonBar } from '../components/button-bar';

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

export const Test6 = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [type, setType] = useState(Camera.Constants.Type.front);
  // How To Type useRef: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31065
  const camera = useRef<Camera>(null);
  const scanline = useRef<ScanlineRef>(null);

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
      <ButtonBar
        onFlip={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          );
        }}
        onStart={() => scanline.current?.start()}
        onStop={() => scanline.current?.stop()}
        onReset={() => scanline.current?.reset()}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#222'
  },
});
