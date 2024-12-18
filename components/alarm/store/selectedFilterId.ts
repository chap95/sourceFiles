import {atom} from 'recoil';

export const selectedAlarmIdState = atom<string>({
  key: 'selectedAlarmIdState',
  default: 'all',
});
