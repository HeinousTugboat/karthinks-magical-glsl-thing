import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Test1 } from './sandbox/test-1'; // Basic Shader Test
import { Test2 } from './sandbox/test-2'; // Uniforms Test
import { Test3 } from './sandbox/test-3'; // Animation Test
import { Test4 } from './sandbox/test-4'; // Camera Test
import { Test5 } from './sandbox/test-5'; // Static Test
import { FirstAttempt } from './sandbox/first-attempt';
import { TestImage } from './sandbox/test-image'; // Scanner + Image
import { TestImageStatic } from './sandbox/test-image-static'; // Scanner + Image + Static?
import 'webgltexture-loader-expo-camera';

export default function App() {
  const Comp = Test5;
  return (
    <View style={styles.container}>
      <Comp></Comp>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
