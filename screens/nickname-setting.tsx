import React, {useCallback, useState} from 'react';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '@/styles/colors';
import fonts from '@/styles/fonts';
import {accessTokenState, firstSigninState, nicknameState} from '@/states';
import {useRecoilState} from 'recoil';
import axios from 'axios';
import {BASE_URL} from '@/utils/variables';

type nicknameResponse = {
  data: {
    id: string;
    name: string;
    profileImageUrl: string;
    pushNotificationAgreement: boolean;
    useForMarketingAgreement: boolean;
  };
};

function NicknameSetting() {
  const [currentAccessToken, setAccessToken] = useRecoilState(accessTokenState);
  const [nickname, setNickname] = useRecoilState(nicknameState);
  const [firstSignin, setFirstSignin] = useRecoilState(firstSigninState);

  const onNicknameTextChange = useCallback(
    (text: string) => {
      setNickname(text);
    },
    [setNickname],
  );

  const nicknameSubmit = async () => {
    const formData = new FormData();
    formData.append('name', nickname);
    try {
      const nicknameResponse: nicknameResponse = await axios.put(`${BASE_URL}users/me`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${currentAccessToken}`,
        },
      });
      setFirstSignin(false);
    } catch (error) {
      console.log('nickname users/me` error', error);
      //TODO: 중복일 경우, 시스템 알람.
      Alert.alert('실패', '닉넴임 중복');
    }
  };

  const isBtnActivate: boolean = !nickname && !nickname;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <ScrollView>
        <View style={styles.viewWrapper}>
          <Text style={styles.guideHeader}>
            Seek에서 사용할
            {'\n'}
            닉네임을 설정해주세요!
          </Text>

          <Text style={styles.guideDesc}>
            닉네임을 직접 입력할 수 있어요!
            {'\n'}
            편지를 받는 상대에게 보이는 이름입니다.
          </Text>

          <View style={styles.nicknameInputWrapper}>
            <TextInput
              style={styles.nicknameInput}
              value={nickname}
              maxLength={12}
              placeholder={'12글자 이내로 입력해주세요'}
              placeholderTextColor={colors.text_4}
              onChangeText={onNicknameTextChange}
            />
          </View>
        </View>

        <View style={styles.btnWrapper}>
          <TouchableOpacity
            onPress={nicknameSubmit}
            style={
              isBtnActivate
                ? styles.changeNicknameBtnWrapper
                : styles.changeNicknameBtnActivationWrapper
            }
            disabled={isBtnActivate}>
            <View style={styles.changeNicknameTextWrapper}>
              <Text
                style={
                  isBtnActivate ? styles.changeNicknameText : styles.changeNicknameActivationText
                }>
                확인
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg_6,
    height: Dimensions.get('window').height,
  },
  viewWrapper: {
    height: (Dimensions.get('window').height * 4) / 5,
  },
  guideHeader: {
    marginTop: 48,
    marginLeft: 20,
    fontWeight: '700',
    color: colors.text_1,
    fontSize: fonts.h2.fontSize,
  },
  guideDesc: {
    marginLeft: 20,
    color: colors.text_4,
    fontSize: fonts.body4.fontSize,
    marginTop: 24,
  },
  nicknameInputWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  nicknameInput: {
    backgroundColor: colors.bg_4,
    height: 44,
    width: Dimensions.get('window').width - 40,
    color: colors.text_1,
    borderRadius: 8,
    marginTop: 72,
    paddingLeft: 12,
  },
  btnWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  changeNicknameBtnWrapper: {
    backgroundColor: colors.bg_4,
    borderRadius: 8,
    justifyContent: 'center',
    height: Dimensions.get('window').width / 8,
    width: Dimensions.get('window').width - 40,
    marginBottom: 10,
  },
  changeNicknameBtnActivationWrapper: {
    backgroundColor: colors.primary_default,
    borderRadius: 8,
    justifyContent: 'center',
    height: Dimensions.get('window').width / 8,
    width: Dimensions.get('window').width - 40,
  },
  changeNicknameTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeNicknameText: {
    color: colors.text_3,
    textAlign: 'center',
  },
  changeNicknameActivationText: {
    color: colors.text_1,
    textAlign: 'center',
  },
});
export default NicknameSetting;
