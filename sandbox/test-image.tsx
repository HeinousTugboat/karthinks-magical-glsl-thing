import React from 'react';
import { Surface } from 'gl-react-expo';
import { View } from 'react-native';
import { ScanlineStatic as Scanline, ScanlineRef } from '../components/scanline-static';
import { Image } from '../components/image';
import { ButtonBar } from '../components/button-bar';

const sourceImage = require('assets/test-image.png');

export const TestImage = () => {
  const scanline = React.useRef<ScanlineRef>(null);

  return (
    <>
      <View style={{ width: 300, height: 300 }}>
        <Surface style={{ width: 300, height: 300 }}>
          <Scanline speed={300} size={300} ref={scanline}>
            <Image src={sourceImage} />
          </Scanline>
        </Surface>
      </View>
      <ButtonBar
        onStart={() => scanline.current?.start()}
        onStop={() => scanline.current?.stop()}
        onReset={() => scanline.current?.reset()}
      />
    </>
  );
}
