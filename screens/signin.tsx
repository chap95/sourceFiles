import {set} from '@/common/values';
import colors from '@/styles/colors';
import fonts from '@/styles/fonts';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {KakaoOAuthToken, loginWithKakaoAccount} from '@react-native-seoul/kakao-login';
import axios from 'axios';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {AppleSymbol, KakaoSymbol, Logo} from '@/assets';

import {accessTokenState, firstSigninState, nicknameState} from '@/states';
import {setTokenInSeekServiceAxiosInstance} from '@/utils/axiosinstances';
import {useRecoilState} from 'recoil';

import {BASE_URL} from '@/utils/variables';

import usePhoneInfo from '@/hooks/use-phone-info';

type tokenList = {
  data: {
    id: string;
    name: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    signUp: boolean;
  };
};

function SignIn() {
  const [loading, setLoading] = useState(false);

  // const setAccessToken = useSetRecoilState(accessTokenState);
  const [currentAccessToken, setAccessToken] = useRecoilState(accessTokenState);
  const [firstSignin, setFirstSignin] = useRecoilState(firstSigninState);
  const [nickname, setNickname] = useRecoilState(nicknameState);

  const {token, model} = usePhoneInfo();

  const submitViaKakao = async (): Promise<void> => {
    if (loading) {
      return;
    }

    try {
      // 카카오 서버 연동
      const result: KakaoOAuthToken = await loginWithKakaoAccount();
      setLoading(true);
      try {
        // seek 서버 연동
        const response = await axios.post(`${BASE_URL}auth/v1/login`, {
          socialToken: result.accessToken,
          socialPlatform: 'KAKAO',
          deviceToken: token,
          deviceName: model,
        });
        setToken(response);
      } catch (seekServerError) {
        console.log('Seek server error:', seekServerError);
        Alert.alert('Seek server error', String(seekServerError));
      } finally {
        setLoading(false);
      }
    } catch (kakaoServerError) {
      console.log('Kakao server login error:', kakaoServerError);
    }
  };

  const submitViaApple = async (): Promise<void> => {
    if (loading) {
      return;
    }

    try {
      // 카카오 서버 연동
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
      setLoading(true);
      try {
        // seek 서버 연동
        const response = await axios.post(`${BASE_URL}auth/v1/login`, {
          socialToken: appleAuthRequestResponse.identityToken,
          socialPlatform: 'APPLE',
          deviceToken: token,
          deviceName: model,
        });
        setToken(response);
      } catch (seekServerError) {
        console.log('Seek server error:', seekServerError);
        Alert.alert('Seek server error', String(seekServerError));
      } finally {
        setLoading(false);
      }
    } catch (appleServerError) {
      console.log('Apple server error:', appleServerError);
    }
  };

  const setToken = (response: tokenList) => {
    //FIXME: 엑세스토큰 수정 필요
    setAccessToken(response.data.accessToken);
    setTokenInSeekServiceAxiosInstance(response.data.accessToken);
    setFirstSignin(response.data.signUp);
    setNickname(response.data.name);
    set('refreshToken', response.data.refreshToken);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <View style={styles.wrapper1}>
        <Text style={styles.topText}>우리 사이의 거리를 좁히는</Text>
        <Logo width={120} height={60} />
      </View>
      <View style={styles.wrapper2}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator color="white" />
          </View>
        ) : Platform.OS === 'ios' ? (
          <View>
            <TouchableOpacity
              onPress={submitViaKakao}
              style={styles.kakaoBtnWrapper}
              disabled={loading}>
              <View style={styles.kakaoTextWrapper}>
                <KakaoSymbol width={25} height={20} />
                <Text style={styles.kakaoText}>카카오로 시작하기</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={submitViaApple}
              style={styles.appleBtnWrapper}
              disabled={loading}>
              <View style={styles.appleTextWrapper}>
                <AppleSymbol width={25} height={25} />
                <Text style={styles.appleText}>Apple로 계속하기</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={submitViaKakao}
            style={styles.kakaoBtnWrapper}
            disabled={loading}>
            <View style={styles.kakaoTextWrapper}>
              <KakaoSymbol width={25} height={20} />
              <Text style={styles.kakaoText}>카카오로 시작하기</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.wrapper3}>
        <View style={styles.bottomTextWapper}>
          <Text style={styles.bottomText}>최초 로그인 시 seek</Text>
          <Text style={styles.bottomText}> </Text>
          <Text
            style={styles.bottomLinkText}
            onPress={() =>
              Linking.openURL('https://seek-kr.notion.site/525f126b001543ca87795f5c30f73535')
            }>
            서비스 이용약관
          </Text>
          <Text style={styles.bottomText}>, </Text>
          <Text
            style={styles.bottomLinkText}
            onPress={() =>
              Linking.openURL('https://seek-kr.notion.site/4b05571a77f646168bf262be1b82bcb2')
            }>
            개인보호 취급방침
          </Text>
        </View>
        <View style={styles.bottomTextWapper}>
          <Text
            style={styles.bottomLinkText}
            onPress={() =>
              Linking.openURL('https://seek-kr.notion.site/3e4a233734334f4290c135d879693a1f')
            }>
            위치기반 서비스 이용약관
          </Text>
          <Text style={styles.bottomText}>에 동의하게 됩니다.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg_6, color: 'white'},
  wrapper1: {
    height: Dimensions.get('window').height / 3,
    backgroundColor: colors.bg_6,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  wrapper2: {
    height: Dimensions.get('window').height / 3,
    backgroundColor: colors.bg_6,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  wrapper3: {
    height: Dimensions.get('window').height / 3,
    backgroundColor: colors.bg_6,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingBottom: 120,
  },
  topText: {
    color: colors.text_4,
    fontWeight: '500',
    fontSize: fonts.h5.fontSize,
    marginBottom: 15,
  },
  bottomTextWapper: {
    flexDirection: 'row',
    marginTop: 3,
  },
  bottomText: {
    color: colors.text_4,
    fontWeight: '500',
    fontSize: fonts.button3.fontSize,
  },
  bottomLinkText: {
    color: colors.text_4,
    fontWeight: '500',
    fontSize: fonts.button3.fontSize,
    textDecorationLine: 'underline',
  },
  kakaoBtnWrapper: {
    backgroundColor: '#FEE500',
    borderRadius: 10,
    justifyContent: 'center',
    height: Dimensions.get('window').width / 8,
    width: Dimensions.get('window').width - 20,
    marginBottom: 10,
  },
  appleBtnWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    justifyContent: 'center',
    height: Dimensions.get('window').width / 8,
    width: Dimensions.get('window').width - 20,
    marginBottom: 10,
  },
  kakaoTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appleTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kakaoText: {
    color: colors.text_6,
    textAlign: 'center',
    marginLeft: 10,
  },
  appleText: {
    color: colors.text_6,
    textAlign: 'center',
    marginLeft: 10,
  },
  loading: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: 30,
    padding: 8,
  },
});

export default SignIn;
