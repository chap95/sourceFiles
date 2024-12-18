const colors: Palette = {
  bg_0: '#FFFFFF',
  bg_1: '#4A4C5D',
  bg_2: '#333442',
  bg_3: '#2B2C3F',
  bg_4: '#212232',
  bg_5: '#1B1C2C',
  bg_6: '#161524',
  ling_1: '#FFFFFF',
  ling_2: '#616161',
  ling_3: '#434344',
  primary_default: '#604DF2',
  primary_light: '#A298F8',
  secondary_default: '#F33D6E',
  secondary_light: '#FEC4D3',
  text_1: '#FFFFFF',
  text_2: '#CCCCCC',
  text_3: '#6C6C6C',
  text_4: '#5D6077',
  text_5: '#4A4C5D',
  text_6: '#161524',
  icon_off: '#333442',
  icon_on: '#FFFFFF',
  icon_point: '#604DF2',
  icon_dark: '#161524',
  success: '#604DF2',
  danger: '#E14F3B',
  gradation: 'linear-gradient(180deg, #604DF2 0%, #A298F8 100%)',
  shadow: '#000000',
} as const;

export type PaletteKeyType =
  | 'bg_0'
  | 'bg_1'
  | 'bg_2'
  | 'bg_3'
  | 'bg_4'
  | 'bg_5'
  | 'bg_6'
  | 'ling_1'
  | 'ling_2'
  | 'ling_3'
  | 'primary_default'
  | 'primary_light'
  | 'secondary_default'
  | 'secondary_light'
  | 'text_1'
  | 'text_2'
  | 'text_3'
  | 'text_4'
  | 'text_5'
  | 'text_6'
  | 'icon_off'
  | 'icon_on'
  | 'icon_point'
  | 'icon_dark'
  | 'success'
  | 'danger'
  | 'gradation'
  | 'shadow';

export type Palette = {[key in PaletteKeyType]: string};

export default colors;
