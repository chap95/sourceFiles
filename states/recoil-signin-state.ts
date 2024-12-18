import {atom} from 'recoil';

export const accessTokenState = atom<string | null>({
  key: 'accessToken',
  default: null,
});

export const firstSigninState = atom<boolean | null>({
  key: 'firstSigninState',
  default: false,
});

export const nicknameState = atom<string>({
  key: 'nicknameState',
  default: '',
});

export const profileImageUrlState = atom<string | null>({
  key: 'profileImageUrlState',
  default: '',
});
