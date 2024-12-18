import CommonDrawer from '@/navigator/common-drawer';
import NicknameSettingStack from '@/navigator/nickname-setting-stack';
import SigninStack from '@/navigator/signin-stack';
import React, {useEffect} from 'react';

import {get, set} from '@/common/values';
import axios from 'axios';

import {accessTokenState, firstSigninState, shareTokenState} from '@/states';
import {RootParamList} from '@/types/navigation-types';
import {setTokenInSeekServiceAxiosInstance} from '@/utils/axiosinstances';
import {useQuery} from '@tanstack/react-query';
import {useRecoilState} from 'recoil';

import SplashScreen from 'react-native-splash-screen';

import {BASE_URL} from '@/utils/variables';
import {RouteProp, useRoute} from '@react-navigation/native';

import {useLetterRecipients} from '@/hooks/letter/useLetterRecipients';
import messaging from '@react-native-firebase/messaging';
import {getModel} from 'react-native-device-info';

function EntryPoint() {
  const route = useRoute<RouteProp<RootParamList, 'EntryPoint'>>();

  const {params} = route;
  const {shareToken: shareTokenParams} = params ?? {};

  const [currentAccessToken, setAccessToken] = useRecoilState(accessTokenState);
  const [firstSignin, setFirstSignin] = useRecoilState(firstSigninState);
  const [shareToken, setShareToken] = useRecoilState(shareTokenState);

  const {postLetterRecipients} = useLetterRecipients({
    shareToken: shareToken,
  });

  // 딥링크로 온 shareToken파라미터 저장

  // 앱 실행 시 토큰 있으면 로그인하는 코드
  const getRefreshTokenWithAxios = async () => {
    const refreshToken = await get('refreshToken');

    if (!messaging().isDeviceRegisteredForRemoteMessages) {
      await messaging().registerDeviceForRemoteMessages();
    }
    const deviceToken = await messaging().getToken();
    const deviceName = await getModel();

    // await remove('refreshToken');
    if (!refreshToken) {
      SplashScreen.hide();
      setAccessToken(null);
      return {
        accessToken: '',
        accessExpiredIn: 0,
        refreshToken: '',
        refreshExpiredIn: 0,
      };
    }

    const {data} = await axios.post(`${BASE_URL}auth/access-token`, {
      refreshToken,
      deviceToken,
      deviceName,
    });
    return data;
  };

  const query = useQuery(['accessTokenFromRefreshToken'], getRefreshTokenWithAxios, {
    refetchOnWindowFocus: false, // react-query는 사용자가 사용하는 윈도우가 다른 곳을 갔다가 다시 화면으로 돌아오면 이 함수를 재실행합니다. 그 재실행 여부 옵션 입니다.
    retry: 1, // 실패시 재호출 몇번 할지
    onSuccess: data => {
      console.log('accessTokenFromRefreshToken success');
      //FIXME: 엑세스토큰 수정 필요
      setAccessToken(data.accessToken);
      setTokenInSeekServiceAxiosInstance(data.accessToken);
      set('refreshToken', data.refreshToken);
    },
    onError: e => {
      console.log('accessTokenFromRefreshToken error', e);
      // auth/access-token가 에러일 경우, 로그인 화면으로 전환
      setAccessToken(null);
    },
    onSettled: async () => {
      SplashScreen.hide();
      setFirstSignin(false);
      console.log('accessTokenFromRefreshToken end');
    },
  });

  useEffect(() => {
    if (shareTokenParams && !shareToken) {
      setShareToken(shareTokenParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareTokenParams, shareToken]);

  useEffect(() => {
    if (currentAccessToken && shareToken) {
      postLetterRecipients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccessToken]);

  return currentAccessToken ? (
    firstSignin ? (
      <NicknameSettingStack />
    ) : (
      <CommonDrawer />
    )
  ) : (
    <SigninStack />
  );
}

export default EntryPoint;
