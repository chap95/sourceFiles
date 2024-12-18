import {atom} from 'recoil';

export const isShowLetterReportIconState = atom<boolean>({
  key: 'isShowLetterReportIconState',
  default: false,
});

export const isShowLetterReportState = atom<boolean>({
  key: 'isShowLetterReportState',
  default: false,
});
