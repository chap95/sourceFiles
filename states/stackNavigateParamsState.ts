import {atom} from 'recoil';

export const stackNavigateParamsState = atom<{[key: string]: any} | null>({
  key: 'stackNavigateParamsState',
  default: null,
});
