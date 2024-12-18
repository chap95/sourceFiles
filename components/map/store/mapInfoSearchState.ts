import {atom} from 'recoil';

export const mapInfoSearchKeywordState = atom<string | null>({
  key: 'mapInfoSearchKeywordState',
  default: null,
});
