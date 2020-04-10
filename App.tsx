import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Test1 } from './sandbox/test-1';
import { Test2 } from './sandbox/test-2';
import { Test3 } from './sandbox/test-3';
import { Test4 } from './sandbox/test-4';
import { FirstAttempt } from './sandbox/first-attempt';
import { TestImage } from './sandbox/test-image';
import 'webgltexture-loader-expo-camera';

export default function App() {
  const Comp = TestImage;
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
