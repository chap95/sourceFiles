import {atom} from 'recoil';

export const selectedIdState = atom<string>({
  key: 'selectedIdState',
  default: 'all',
});
