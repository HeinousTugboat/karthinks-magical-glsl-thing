import React from 'react';
import { View } from 'react-native';

import { width, height, clampVec } from '../utils';

export const Test3 = () => {
  const [coord, setCoord] = React.useState({x: 0, y: 0});
  const [moving, keepMoving] = React.useState(true);

  const time = React.useRef(Date.now());
  const dT = React.useRef(0);

  const move = (tick: number) => {
    dT.current = tick - time.current;
    time.current = tick;

    setCoord(({x, y}) => {
      const newCoord = {
        x: x + 50/dT.current,
        y: y + 50/dT.current
      }

      if (newCoord.x > width) {
        newCoord.x = newCoord.x - width;
      }

      if (newCoord.y > height) {
        newCoord.y = newCoord.y - height;
      }

      return clampVec(newCoord);
    });

    if (moving) {
      requestAnimationFrame(move);
    }
  };

  React.useEffect(() => {requestAnimationFrame(move)}, []);

  return (
    <View
      style={{
        top: coord.y ?? 0,
        left: coord.x ?? 0,
        width: 50,
        height: 50,
        backgroundColor: '#0F03',
        borderWidth: 1,
        borderColor: '#0F0',
        position: 'absolute',
      }}
    ></View>
  );
}
