import {ValueOf} from '@/types/global-types';

export enum WeightType {
  Bold = 700,
  Medium = 500,
  Regular = 400,
}
interface FontObj {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
}

const fonts: FontsType = {
  h1: {
    fontFamily: 'Pretendard',
    fontSize: 40,
    fontWeight: WeightType.Bold,
  },
  h2: {
    fontFamily: 'Pretendard',
    fontSize: 24,
    fontWeight: WeightType.Bold,
  },
  h3: {
    fontFamily: 'Pretendard',
    fontSize: 20,
    fontWeight: WeightType.Bold,
  },
  h4: {
    fontFamily: 'Pretendard',
    fontSize: 18,
    fontWeight: WeightType.Bold,
  },
  h5: {
    fontFamily: 'Pretendard',
    fontSize: 18,
    fontWeight: WeightType.Medium,
  },
  body1: {
    fontFamily: 'Pretendard',
    fontSize: 16,
    fontWeight: WeightType.Bold,
  },
  body2: {
    fontFamily: 'Pretendard',
    fontSize: 16,
    fontWeight: WeightType.Medium,
  },
  body3: {
    fontFamily: 'Pretendard',
    fontSize: 16,
    fontWeight: WeightType.Regular,
  },
  body4: {
    fontFamily: 'Pretendard',
    fontSize: 14,
    fontWeight: WeightType.Medium,
  },
  body5: {
    fontFamily: 'Pretendard',
    fontSize: 12,
    fontWeight: WeightType.Medium,
  },
  body6: {
    fontFamily: 'Pretendard',
    fontSize: 12,
    fontWeight: WeightType.Regular,
  },
  button1: {
    fontFamily: 'Pretendard',
    fontSize: 16,
    fontWeight: WeightType.Medium,
  },
  button2: {
    fontFamily: 'Pretendard',
    fontSize: 16,
    fontWeight: WeightType.Regular,
  },
  button3: {
    fontFamily: 'Pretendard',
    fontSize: 12,
    fontWeight: WeightType.Medium,
  },
  caption1: {
    fontFamily: 'Pretendard',
    fontSize: 12,
    fontWeight: WeightType.Regular,
  },
  caption2: {
    fontFamily: 'Pretendard',
    fontSize: 10,
    fontWeight: WeightType.Regular,
  },
} as const;

export type FontsKeyType =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'body1'
  | 'body2'
  | 'body3'
  | 'body4'
  | 'body5'
  | 'body6'
  | 'button1'
  | 'button2'
  | 'button3'
  | 'caption1'
  | 'caption2';

export type FontsType = {[key in FontsKeyType]: FontObj};

export default fonts;
