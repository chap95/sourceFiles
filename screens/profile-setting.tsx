/* eslint-disable react-hooks/exhaustive-deps */
import useImagePicker from '@/hooks/use-image-picker';
import {
  accessTokenState,
  nicknameState,
  profileImagesPreviewState,
  profileImagesState,
  profileImageUrlState,
} from '@/states';
import colors from '@/styles/colors';
import axios from 'axios';
import React, {useCallback, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useRecoilState, useResetRecoilState} from 'recoil';

import {remove} from '@/common/values';
import {useUnregister} from '@/hooks/useUnregister';
import {BASE_URL} from '@/utils/variables';
import {useFocusEffect} from '@react-navigation/native';

type profileResponse = {
  data: {
    id: string;
    name: string;
    profileImageUrl: string;
    pushNotificationAgreement: boolean;
    useForMarketingAgreement: boolean;
  };
};

function ProfileSetting({navigation}: any) {
  const [currentAccessToken] = useRecoilState(accessTokenState);
  const resetAccessToken = useResetRecoilState(accessTokenState);
  const [profileImages, setProfileImages] = useRecoilState(profileImagesState);
  const [profileImagesPreview, setProfileImagesPreview] = useRecoilState(profileImagesPreviewState);
  const [profileImageUrlRecoil, setProfileImageUrlRecoil] = useRecoilState(profileImageUrlState);

  const [nickname, setNickname] = useRecoilState(nicknameState);

  const {createTwoButtonAlert, isLoadingImage} = useImagePicker(
    setProfileImagesPreview,
    setProfileImages,
  );

  const handleUnregisterSuccess = useCallback(async () => {
    resetAccessToken();
    await remove('refreshToken');
  }, []);

  const {
    unRegister,
    isSuccess: isSuccessUnregister,
    isError: isErrorUnregister,
    isLoading: isLoadingUnregister,
  } = useUnregister(currentAccessToken, handleUnregisterSuccess);

  const onNicknameTextChange = useCallback(
    (text: string) => {
      setNickname(text);
    },
    [setNickname],
  );

  const nicknameSubmit = async () => {
    const formData = new FormData();
    formData.append('name', nickname);
    if (profileImages !== null) {
      formData.append('profileImageFile', profileImages);
    }
    formData.append('imageUpdate', true);

    try {
      const profileResponse: profileResponse = await axios.put(`${BASE_URL}users/me`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${currentAccessToken}`,
        },
      });
      navigation.goBack();
      setProfileImageUrlRecoil(profileResponse.data.profileImageUrl);
    } catch (error) {
      console.log('nickname users/me` error', error);
      //TODO: 중복일 경우, 시스템 알람.
      Alert.alert('error', String(error));
    }
  };

  const isBtnActivate: boolean = !nickname && !nickname;

  const imageBranch = useCallback(() => {
    if (profileImagesPreview) {
      return (
        <Pressable onPress={createTwoButtonAlert} style={styles.imagePreviewLoadWrapper}>
          <Image style={styles.profileImage} source={profileImagesPreview} />
        </Pressable>
      );
    } else {
      if (profileImageUrlRecoil) {
        return (
          <Pressable onPress={createTwoButtonAlert} style={styles.imagePreviewLoadWrapper}>
            <Image style={styles.profileImage} source={{uri: profileImageUrlRecoil}} />
          </Pressable>
        );
      } else {
        return (
          <Pressable onPress={createTwoButtonAlert} style={styles.imagePreviewLoadWrapper}>
            <Image style={styles.profileImage} source={require('assets/seekseekyi.png')} />
          </Pressable>
        );
      }
    }
  }, [profileImagesPreview, profileImageUrlRecoil]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setProfileImagesPreview(null);
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <ScrollView>
        <View>
          <View style={styles.profileViewWrapper}>
            {isLoadingImage ? (
              <View style={styles.imagePreviewLoadWrapper}>
                <ActivityIndicator color="white" />
              </View>
            ) : (
              imageBranch()
            )}
          </View>
          <View style={styles.nicknameInputWrapper}>
            <TextInput
              style={styles.nicknameInput}
              onChangeText={onNicknameTextChange}
              value={nickname}
              placeholder={'12글자 이내로 입력해주세요'}
              maxLength={12}
              placeholderTextColor={colors.text_4}
            />
          </View>

          <View style={styles.btnViewWrapper}>
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
                  저장하기
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.exitMemberButton}>
          {/* TODO Onlick 삽입 */}
          <TouchableOpacity
            onPress={() => {
              unRegister();
            }}>
            <Text style={styles.exitMemberText}>회원 탈퇴</Text>
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
    flex: 1,
  },
  viewWrapper: {
    height: (Dimensions.get('window').height * 4) / 5,
  },
  profileViewWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  imagePreviewLoadWrapper: {
    backgroundColor: colors.bg_4,
    justifyContent: 'center',
    height: 100,
    width: 100,
    borderRadius: 100,
    marginLeft: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    resizeMode: 'contain',
  },
  nicknameInputWrapper: {
    // justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  nicknameInput: {
    backgroundColor: colors.bg_4,
    height: 44,
    width: Dimensions.get('window').width - 40,
    color: colors.text_1,
    borderRadius: 8,
    paddingLeft: 12,
  },
  btnWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  btnViewWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 44,
    marginBottom: 240,
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
  exitMemberButton: {
    marginBottom: 64,
    flex: 1,
    justifyContent: 'flex-end',
  },
  exitMemberText: {
    justifyContent: 'center',
    textAlign: 'center',
    color: colors.text_2,
  },
});
export default ProfileSetting;
