import React from 'react';
import { Surface } from 'gl-react-expo';
import { View } from 'react-native';
import { Scanline } from '../components/scanline';
import { Image } from '../components/image';

const sourceImage = require('assets/test-image.png');

export const TestImage = () => {
    return (
      <View style={{width: 300, height: 300}}>
        <Surface style={{width: 300, height: 300}}>
          <Scanline speed={100} duration={1000}>
            <Image src={sourceImage}/>
          </Scanline>
        </Surface>
      </View>
  );
}
