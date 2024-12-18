import {atom} from 'recoil';

export const shareTokenState = atom<string | undefined>({
  key: 'shareToken',
  default: '',
});
