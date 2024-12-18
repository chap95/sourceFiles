/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
import {useUserLocation} from '@/hooks/useUserLocation';
import useImagePicker from '@/hooks/use-image-picker';
import {writeLetterDataSelector} from '@/states/recoil-write-letter-state';
import colors from '@/styles/colors';
import fonts from '@/styles/fonts';
import {WriteLetterParamList} from '@/types/navigation-types';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useRecoilState, useRecoilValue} from 'recoil';
import {addressInfoState} from '../map/store/addressInfoState';
import SvgIcon from '../svgIcon';

const WriteLetterStepOne = () => {
  const addressInfo = useRecoilValue(addressInfoState);
  const [writeLetterData, setWriteLetterData] = useRecoilState(writeLetterDataSelector);
  const navigation = useNavigation<NavigationProp<WriteLetterParamList>>();
  const handleAttachImageSet = useCallback(
    ({uri, name, type}: {uri: string; name: string; type: string}) => {
      setWriteLetterData({
        coverImage: {
          uri,
          name,
          type,
        },
      });
    },
    [],
  );

  const handleAttachPreviewSet = useCallback(({uri}: {uri: string}) => {
    setWriteLetterData({
      coverImagePreview: {
        uri,
      },
    });
  }, []);

  const {createTwoButtonAlert, isLoadingImage} = useImagePicker(
    handleAttachPreviewSet,
    handleAttachImageSet,
  );

  const isActiveButtonToNextStep = useMemo(() => {
    if (writeLetterData) {
      const {recipientAlias, fullAddress, destinationHint, coverImage} = writeLetterData;

      if (recipientAlias && fullAddress && destinationHint && coverImage) {
        return true;
      }
    }

    return false;
  }, [writeLetterData]);

  const onChangeReceiver = useCallback((text: string) => {
    setWriteLetterData({recipientAlias: text});
  }, []);

  const onChangeLocationHint = useCallback((text: string) => {
    setWriteLetterData({destinationHint: text});
  }, []);

  const {isLoading, getCurrentLocation} = useUserLocation();

  const handleLocationButtonPress = useCallback(
    async (e: any) => {
      e.stopPropagation();
      const {data, userLocation} = await getCurrentLocation();
      let fullAddress = '주소 취득 실패';

      if (data.results.length > 0) {
        fullAddress = `${data.results[0].region?.area1.name} ${
          data.results[0].region?.area2.name
        } ${data.results[0].region?.area3.name} ${data.results[0].region?.area4.name} ${
          data.results[3]?.land?.addition0?.value ? data.results[3]?.land?.addition0?.value : ''
        } ${
          data.results[3]?.land?.addition1?.value ? data.results[3]?.land?.addition1?.value : ''
        }`;
      }

      setWriteLetterData({
        fullAddress: fullAddress,
        longitude: userLocation.longitude,
        latitude: userLocation.latitude,
      });
    },
    [getCurrentLocation, setWriteLetterData],
  );

  const searchLocation = () => {
    navigation.navigate('WriteLetter1Map');
  };

  const goToWriteLetter2 = useCallback(() => {
    navigation.navigate('WriteLetter2');
  }, [navigation]);

  useEffect(() => {
    if (addressInfo) {
      setWriteLetterData({
        latitude: addressInfo.geoLocation.y,
        longitude: addressInfo.geoLocation.x,
        fullAddress: addressInfo.address,
      });
    }
  }, [addressInfo]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <View style={styles.progressWrapper}>
        <View style={styles.leftProgress} />
        <View style={styles.rightProgress} />
      </View>
      <KeyboardAwareScrollView>
        <View style={styles.firstWrapper}>
          <Text style={styles.subTitle}>받는 이는 누구인가요?</Text>
          <Text style={styles.explanation}>받는이의 이름이나, 별명을 입력해주세요</Text>
          <TextInput
            placeholder="씩씩이,한사랑 산악회,사랑하는 부모님"
            placeholderTextColor="#4A4C5D"
            style={styles.textInput}
            value={writeLetterData?.recipientAlias}
            onChangeText={throttle((text: string) => {
              onChangeReceiver(text);
            }, 500)}
            // onBlur={handleGestureBlurFromRecipientAliasInput}
          />
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.subTitle}>위치 지정</Text>
          <Text style={styles.explanation}>현재 위치 설정 및 장소를 검색해 지정할 수 있어요</Text>
          <TouchableOpacity style={styles.locationWrapper} onPress={searchLocation}>
            <View style={styles.locationTextInputWrapper}>
              <TextInput
                placeholder="서울 관악구 행운동"
                placeholderTextColor="#4A4C5D"
                style={styles.locationTextInput}
                value={writeLetterData?.fullAddress}
                editable={false}
              />
            </View>
            <View style={styles.locationIconWrapper}>
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <TouchableOpacity onPress={handleLocationButtonPress}>
                    <SvgIcon size={20} name={'Location'} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={searchLocation} style={styles.searchIconWrapper}>
                    <SvgIcon size={20} name={'Search'} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.subTitle}>위치 힌트 제공</Text>
          <Text style={styles.explanation}>받는 이는 힌트를 보고 편지를 찾아 나설 거예요</Text>
          <TextInput
            placeholder="우리 처음 만난 장소"
            placeholderTextColor="#4A4C5D"
            style={styles.textInput}
            value={writeLetterData?.destinationHint}
            onChangeText={throttle((text: string) => {
              onChangeLocationHint(text);
            }, 500)}
            // onBlur={handleGestureBlurFromDestinationHintInput}
          />
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.subTitle}>배경 사진 첨부</Text>
          <View style={styles.imageWrapper}>
            <View style={styles.imagePreviewWrapper}>
              {isLoadingImage ? (
                <ActivityIndicator color="white" />
              ) : writeLetterData?.coverImagePreview ? (
                <Pressable onPress={createTwoButtonAlert} style={styles.imagePreviewLoadWrapper}>
                  <Image style={styles.previewImage} source={writeLetterData.coverImagePreview} />
                </Pressable>
              ) : (
                <Pressable onPress={createTwoButtonAlert} style={styles.imagePreviewUnloadWrapper}>
                  <SvgIcon size={25} name={'Camera'} />
                </Pressable>
              )}
            </View>
            <View style={styles.imagePreviewTextWrapper}>
              <View>
                <Text style={styles.imagePreviewText1}>Tip</Text>
              </View>
              <View>
                <Text style={styles.imagePreviewText2}>
                  장소와 연관된 사진이면 더욱 뜻깊을 거예요!
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.wrapperbtn}>
          <TouchableOpacity
            onPress={goToWriteLetter2}
            style={
              isActiveButtonToNextStep
                ? styles.writeLetterBtnActivationWrapper
                : styles.writeLetterBtnWrapper
            }
            disabled={!isActiveButtonToNextStep}>
            <View style={styles.writeLetterTextWrapper}>
              <Text
                style={
                  isActiveButtonToNextStep
                    ? styles.writeLetterActivationText
                    : styles.writeLetterText
                }>
                다음
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default WriteLetterStepOne;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg_6,
    height: Dimensions.get('window').height,
  },
  progressWrapper: {
    flexDirection: 'row',
    height: 2,
    marginBottom: 28,
  },
  leftProgress: {
    backgroundColor: colors.primary_default,
    width: '50%',
    color: colors.primary_default,
  },
  rightProgress: {
    backgroundColor: colors.primary_light,
    width: '50%',
    color: colors.bg_2,
  },
  firstWrapper: {
    backgroundColor: colors.bg_6,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginTop: 15,
  },
  wrapper: {
    backgroundColor: colors.bg_6,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  wrapperbtn: {
    height: 100,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  subTitle: {
    color: colors.text_1,
    fontSize: fonts.h5.fontSize,
  },
  explanation: {
    color: colors.text_3,
    fontSize: fonts.body6.fontSize,
    marginTop: 5,
  },
  textInput: {
    backgroundColor: colors.bg_4,
    height: 44,
    width: '100%',
    color: colors.text_1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 15,
  },
  locationTextInput: {
    backgroundColor: colors.bg_4,
    height: 44,
    width: '100%',
    color: colors.text_1,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingHorizontal: 10,
  },
  locationWrapper: {flexDirection: 'row', marginTop: 15},
  locationTextInputWrapper: {flex: 4},
  locationIconWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.bg_4,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  imageWrapper: {
    flexDirection: 'row',
    backgroundColor: colors.bg_5,
    height: 80,
    borderRadius: 10,
    marginTop: 15,
  },
  imagePreviewWrapper: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 10,
  },
  imagePreviewLoadWrapper: {
    backgroundColor: colors.bg_4,
    justifyContent: 'center',
    height: 60,
    width: 60,
    borderRadius: 15,
    marginLeft: 10,
  },
  imagePreviewUnloadWrapper: {
    backgroundColor: colors.bg_4,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 60,
    borderRadius: 15,
    marginLeft: 10,
  },
  previewImage: {
    height: 60,
    width: 60,
    borderRadius: 15,
    resizeMode: 'contain',
  },
  searchIconWrapper: {
    marginLeft: 12,
    marginRight: 15,
  },
  imagePreviewTextWrapper: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 5,
  },
  imagePreviewText1: {
    color: colors.text_4,
  },
  imagePreviewText2: {
    color: colors.text_2,
    fontSize: 10,
  },
  writeLetterBtnWrapper: {
    backgroundColor: colors.bg_4,
    borderRadius: 10,
    justifyContent: 'center',
    height: Dimensions.get('window').width / 8,
    width: Dimensions.get('window').width - 20,
    marginBottom: 10,
  },
  writeLetterBtnActivationWrapper: {
    backgroundColor: colors.primary_default,
    borderRadius: 10,
    justifyContent: 'center',
    height: Dimensions.get('window').width / 8,
    width: Dimensions.get('window').width - 20,
    marginBottom: 10,
  },
  writeLetterTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  writeLetterText: {
    color: colors.text_3,
    fontWeight: '900',
    textAlign: 'center',
    marginLeft: 10,
  },
  writeLetterActivationText: {
    color: colors.text_1,
    fontWeight: '900',
    textAlign: 'center',
    marginLeft: 10,
  },
});
