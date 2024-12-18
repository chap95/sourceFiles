import axios from 'axios';

export function setInterceptor(accessToken: string) {
  axios.interceptors.request.use(async config => {
    if (config && config.headers) {
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  });
}
