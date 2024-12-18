import {useCallback, useState} from 'react';
import {Alert, Platform} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';

const useImagePicker = (setPreview: (image: any) => void, setImage: (image: any) => void) => {
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const onResponse = useCallback(
    async (response: any) => {
      setPreview({uri: `data:${response.mime};base64,${response.data}`});
      setIsLoadingImage(true);

      // 플랫폼 별로 다른 프로퍼티를 사용
      const imagePath = Platform.OS === 'ios' ? response.sourceURL : response.path;
      return ImageResizer.createResizedImage(
        imagePath,
        1200,
        1200,
        response.mime.includes('jpeg') ? 'JPEG' : 'PNG',
        100,
        0,
      )
        .then(r => {
          setImage({
            uri: r.uri,
            name: r.name,
            type: response.mime,
          });
          setIsLoadingImage(false);
        })
        .catch(e => {
          setIsLoadingImage(false);
          console.log(e);
        });
    },
    [setPreview, setImage],
  );

  const onTakePhoto = useCallback(() => {
    setIsLoadingImage(true);
    return ImagePicker.openCamera({
      includeBase64: true,
      includeExif: true,
      cropping: true,
    })
      .then(onResponse)
      .catch(e => {
        setIsLoadingImage(false);
        console.log(e);
      });
  }, [onResponse]);

  const onChangeFile = useCallback(() => {
    setIsLoadingImage(true);
    return ImagePicker.openPicker({
      includeExif: true, // 사진 메타 데이터
      includeBase64: true,
      cropping: true, // 이미지 수정 가능
      mediaType: 'photo',
    })
      .then(onResponse)
      .catch(e => {
        setIsLoadingImage(false);
        console.log(e);
      });
  }, [onResponse]);

  const createTwoButtonAlert = useCallback(() => {
    Alert.alert(
      '사진 첨부',
      undefined,
      [
        {
          text: '사진보관함',
          onPress: onChangeFile,
        },
        {text: '사진 찍기', onPress: onTakePhoto},
        {text: '취소', onPress: () => console.log('Cancel Pressed')},
      ],
      {cancelable: false},
    );
  }, [onChangeFile, onTakePhoto]);

  return {createTwoButtonAlert, isLoadingImage};
};

export default useImagePicker;
