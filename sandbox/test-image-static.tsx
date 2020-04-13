import React from 'react';
import { Surface } from 'gl-react-expo';
import { View } from 'react-native';
import { Scanline, ScanlineRef } from '../components/scanline';
import { Image } from '../components/image';
import { ButtonBar } from '../components/button-bar';
import { Static } from '../components/static';

const sourceImage = require('assets/test-image.png');

export const TestImageStatic = () => {
  const scanline = React.useRef<ScanlineRef>(null);

  return (
    <>
      <View style={{ width: 300, height: 300 }}>
        <Surface style={{ width: 300, height: 300 }}>
          <Scanline speed={300} size={300} ref={scanline}>
            <Static offset={1} octave={8} color={[0, 0.5, 0, 0.5]}>
              {/* <Static offset={1} octave={16} color={[1, 0.5, 0.5, 0.25]}> */}
                {/* <Static offset={1} octave={8} color={[0.5, 0.5, 1, 0.25]}> */}
                  <Image src={sourceImage} />
                </Static>
              {/* </Static> */}
            {/* </Static> */}
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
