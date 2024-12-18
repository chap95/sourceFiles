import axios from 'axios';
import qs from 'qs';
import {BASE_URL, KAKAO_BASE_URL} from './variables';

export const seekServiceAxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 1000 * 10,
  paramsSerializer: {
    serialize: function (params: any) {
      return qs.stringify(params, {arrayFormat: 'comma', encode: false});
    },
  },
  // headers: TODO ### 여기에 accessToken 을 저장해놓은 값을 불러와야 합니다.
});

export const kakoApiServiceAxiosInstance = axios.create({
  baseURL: KAKAO_BASE_URL,
  timeout: 1000 * 10,
  paramsSerializer: {
    serialize: function (params: any) {
      return qs.stringify(params, {arrayFormat: 'comma', encode: false});
    },
  },
  headers: {
    Authorization: 'KakaoAK 1ec876ec2fe25e23ca37df10b9564ead',
  },
});

export const setTokenInSeekServiceAxiosInstance = (accessToken: string) => {
  seekServiceAxiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
};

seekServiceAxiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },

  function (error) {
    console.error(error.message);

    return Promise.reject(error);
  },
);
