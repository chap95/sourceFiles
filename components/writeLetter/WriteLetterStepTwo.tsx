/* eslint-disable react-hooks/exhaustive-deps */
import {lettersResponse, useSendLetter} from '@/hooks/sendLetter/useSendLetter';
import useImagePicker from '@/hooks/use-image-picker';
import {writeLetterDataSelector} from '@/states';
import colors from '@/styles/colors';
import fonts from '@/styles/fonts';
import {WriteLetterParamList} from '@/types/navigation-types';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';
import React, {useCallback} from 'react';
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
import {useRecoilState, useSetRecoilState} from 'recoil';
import {addressInfoState} from '../map/store/addressInfoState';
import SvgIcon from '../svgIcon';

const WriteLetterStepTwo = () => {
  const setAddressInfo = useSetRecoilState(addressInfoState);
  const [writeLetterData, setWriteLetterData] = useRecoilState(writeLetterDataSelector);

  const navigation = useNavigation<NavigationProp<WriteLetterParamList>>();

  const handleAttachImageSet = useCallback(
    ({uri, name, type}: {uri: string; name: string; type: string}) => {
      setWriteLetterData({
        attachImages: {
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
      attachImagesPreview: {
        uri,
      },
    });
  }, []);

  const {createTwoButtonAlert, isLoadingImage} = useImagePicker(
    handleAttachPreviewSet,
    handleAttachImageSet,
  );

  const onChangeLetterContents = useCallback((text: string) => {
    setWriteLetterData({
      content: text,
    });
  }, []);

  const handleSendLetterSuccess = useCallback(
    (response: lettersResponse) => {
      console.log('### [success] => send letter');

      setAddressInfo(null);
      setWriteLetterData(null);
      navigation.navigate('Mailing', {
        letterId: response.data.id,
        writerName: response.data.writerName,
        destinationHint: response.data.destinationHint,
        shareToken: response.data.shareToken,
      });
    },
    [setWriteLetterData, navigation],
  );

  const {isLoading, isError, sendLetterSync} = useSendLetter({
    key: ['send'],
    handleSendLetterSuccess,
  });

  const handleSubmitButtonPress = useCallback(() => {
    if (!writeLetterData) {
      return Alert.alert('알림', '필수사항을 입력해주세요');
    }

    const {recipientAlias, fullAddress, destinationHint, coverImage, content, latitude, longitude} =
      writeLetterData;

    if (!recipientAlias || !recipientAlias.trim()) {
      return Alert.alert('알림', '받는 사람을 입력해 주세요.');
    }
    if (!fullAddress || !fullAddress.trim()) {
      return Alert.alert('알림', '위치 지정을 해주세요.');
    }
    if (!destinationHint || !destinationHint.trim()) {
      return Alert.alert('알림', '위치 힌트를 입력해 주세요.');
    }
    if (!coverImage) {
      return Alert.alert('알림', '배경 사진을 첨부해 주세요.');
    }
    if (!content || !content.trim()) {
      return Alert.alert('알림', '편지 내용을 작성해 주세요.');
    }
    if (!latitude || !longitude) {
      return Alert.alert('알림', '주소 좌표 정보가 존재하지 않습니다.');
    }

    const sendLetterFormData = new FormData();

    Object.keys(writeLetterData).forEach(key => {
      if (key !== 'coverImagePreview' && key !== 'attachImagesPreview') {
        sendLetterFormData.append(key, (writeLetterData as any)[key]);
      }
    });

    sendLetterSync(sendLetterFormData);
  }, [writeLetterData]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <View style={styles.progressWrapper} />
      <KeyboardAwareScrollView>
        <View style={styles.wrapper}>
          <Text style={styles.subTitle}>편지 내용을 작성해주세요.</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              underlineColorAndroid="transparent"
              placeholderTextColor="grey"
              editable
              multiline
              numberOfLines={10}
              maxLength={1000}
              value={writeLetterData?.content}
              textAlignVertical={'top'}
              onChangeText={throttle((text: string) => {
                onChangeLetterContents(text);
              }, 500)}
              placeholder="편지 내용을 작성해주세요."
            />
          </View>
        </View>
        <View style={styles.wrapper2}>
          <Text style={styles.subTitle}>추가 사진 첨부 (선택)</Text>
          <Text style={styles.explanation}>편지와 함께 보낼 사진이 있다면 선택해 주세요</Text>
          <View style={styles.imageWrapper}>
            <View style={styles.imagePreviewWrapper}>
              {isLoadingImage ? (
                <ActivityIndicator color="white" />
              ) : writeLetterData?.attachImagesPreview ? (
                <Pressable onPress={createTwoButtonAlert} style={styles.imagePreviewLoadWrapper}>
                  <Image style={styles.previewImage} source={writeLetterData.attachImagesPreview} />
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
                <Text style={styles.imagePreviewText2}>기프티콘 이미지를 첨부해 보세요!</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.wrapperbtn}>
          <TouchableOpacity
            onPress={handleSubmitButtonPress}
            style={styles.writeLetterBtnActivationWrapper}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <View style={styles.writeLetterTextWrapper}>
                <Text style={styles.writeLetterActivationText}>편지 작성 완료</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default WriteLetterStepTwo;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg_6, height: Dimensions.get('window').height},
  wrapper: {
    height: 400,
    backgroundColor: colors.bg_6,
    paddingHorizontal: 20,
    marginTop: 28,
  },
  progressWrapper: {
    height: 2,
  },
  wrapper2: {
    height: 130,
    backgroundColor: colors.bg_6,
    paddingHorizontal: 20,
    marginTop: 40,
  },
  wrapperbtn: {
    height: 130,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  subTitle: {
    color: colors.text_1,
    fontSize: fonts.h5.fontSize,
    fontWeight: '500',
  },
  explanation: {
    color: colors.text_3,
    fontSize: fonts.body6.fontSize,
    marginTop: 5,
  },
  textAreaContainer: {
    marginTop: 20,
    backgroundColor: colors.bg_4,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  textArea: {
    color: colors.text_1,
    height: '90%',
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
  writeLetterActivationText: {
    color: colors.text_1,
    fontWeight: '900',
    textAlign: 'center',
    marginLeft: 10,
  },
});
