import {atom} from 'recoil';

export const phoneInfoState = atom<{token: string; model: string}>({
  key: 'phoneInfo',
  default: {token: '', model: ''},
});
