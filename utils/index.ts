import { Dimensions, Platform } from 'react-native';

export const {width, height} = Dimensions.get('window');

export const Breakpoints = {
  isSmall: 'isSmall',
  isLarge: 'isLarge',
  isExtraLarge: 'isExtraLarge',
  isAndroid: 'isAndroid',
  isIos: 'isIos',
  isPad: 'isPad',
  isTVOS: 'isTVOS',
  isIphoneX: 'isIphoneX',
  minWidthSM: 'minWidthSM',
  minWidthMD: 'minWidthMD',
  minWidthLG: 'minWidthLG',
  minWidthXL: 'minWidthXL',
  minHeightSM: 'minHeightSM',
  minHeightMD: 'minHeightMD',
  minHeightLG: 'minHeightLG',
  minHeightXL: 'minHeightXL',
};



export const BreakpointValues = {
  [Breakpoints.isAndroid]: Platform.OS === 'android',
  [Breakpoints.isIos]: Platform.OS === 'ios',
};

export type Coord = {x: number, y: number};

export const clamp = (n: number, min: number, max: number): number => Math.min(Math.max(n, min), max);
export const clampVec = ({x, y}: Coord): Coord => ({x: clamp(x, 0, width), y: clamp(y, 0, height)});
