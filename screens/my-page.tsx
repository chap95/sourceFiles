import {remove} from '@/common/values';
import SvgIcon from '@/components/svgIcon';
import usePhoneInfo from '@/hooks/use-phone-info';
import {accessTokenState, nicknameState, profileImageUrlState} from '@/states';
import colors from '@/styles/colors';
import fonts from '@/styles/fonts';
import {BASE_URL} from '@/utils/variables';
import axios from 'axios';
import React, {useCallback} from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useRecoilState, useRecoilValue, useResetRecoilState} from 'recoil';

function MyPage({navigation}: any) {
  const nickname = useRecoilValue(nicknameState);
  const [profileImageUrlRecoil, setProfileImageUrlRecoil] = useRecoilState(profileImageUrlState);
  const [currentAccessToken, setAccessToken] = useRecoilState(accessTokenState);
  const resetAccessTokenState = useResetRecoilState(accessTokenState);

  const {token, model} = usePhoneInfo();

  //로그아웃 함수
  const logout = useCallback(async () => {
    try {
      // Seek 서버 연동
      const response = await axios.delete(`${BASE_URL}auth/device-token`, {
        data: {
          deviceToken: token,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentAccessToken}`,
        },
      });

      resetAccessTokenState();
      await remove('refreshToken');
    } catch (seekServerError) {
      console.error('Seek server logout error:', seekServerError);
    }
  }, [currentAccessToken, token, resetAccessTokenState]);

  return (
    <SafeAreaView>
      <View style={styles.wrapper1}>
        <Pressable onPress={() => navigation.goBack()}>
          <SvgIcon size={20} name={'Close'} />
        </Pressable>
      </View>
      <View style={styles.wrapper2}>
        <View>
          {profileImageUrlRecoil ? (
            <Image style={styles.profileImage} source={{uri: profileImageUrlRecoil}} />
          ) : (
            <Image style={styles.profileImage} source={require('assets/seekseekyi.png')} />
          )}
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.myPageText1}>{nickname}</Text>
        </View>
      </View>
      <View style={styles.wrapper3}>
        <Pressable onPress={() => navigation.navigate('ProfileSettingStack')}>
          <Text style={styles.myPageText1}>프로필 수정</Text>
        </Pressable>
        <Pressable onPress={() => Linking.openSettings()}>
          <Text style={styles.myPageText1}>알림 설정</Text>
        </Pressable>
        <Pressable onPress={() => Linking.openSettings()}>
          <Text style={styles.myPageText1}>권한 관리</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            Linking.openURL('https://seek-kr.notion.site/525f126b001543ca87795f5c30f73535')
          }>
          <Text style={styles.myPageText1}>이용약관</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            Linking.openURL('https://seek-kr.notion.site/4b05571a77f646168bf262be1b82bcb2')
          }>
          <Text style={styles.myPageText1}>개인정보처리방침</Text>
        </Pressable>
      </View>
      <View style={styles.wrapper4}>
        <Pressable onPress={logout}>
          <Text style={styles.myPageText1}>로그아웃</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper1: {
    height: Dimensions.get('window').height / 20,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  wrapper2: {
    height: (Dimensions.get('window').height / 20) * 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper3: {
    height: (Dimensions.get('window').height / 20) * 11,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: (Dimensions.get('window').height / 20) * 2,
  },
  wrapper4: {
    height: (Dimensions.get('window').height / 20) * 4,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  myPageText1: {
    color: colors.text_1,
    fontSize: fonts.h3.fontSize,
  },
});

export default MyPage;
