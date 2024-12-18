import {atom} from 'recoil';

export interface AddressInfo {
  address: string;
  detailAddress: string;
  geoLocation: {
    x: number;
    y: number;
  };
}

export const addressInfoState = atom<AddressInfo | null>({
  key: 'addressInfoState',
  default: null,
});

export const isPressedSearchBarState = atom<boolean>({
  key: 'isPressedSearchBarState',
  default: false,
});
