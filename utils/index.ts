import { Dimensions } from 'react-native';

export const {width, height} = Dimensions.get('window');

export type Coord = {x: number, y: number};

export const clamp = (n: number, min: number, max: number): number => Math.min(Math.max(n, min), max);
export const clampVec = ({x, y}: Coord): Coord => ({x: clamp(x, 0, width), y: clamp(y, 0, height)});
