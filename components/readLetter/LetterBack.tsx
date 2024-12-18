import {LetterReceivedDetailData} from '@/hooks/readLetter';
import React, {useState} from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SvgIcon from '../svgIcon';

export interface LetterBackData extends LetterReceivedDetailData {
  navigation: any;
}

const LetterBack = ({
  destinationHint,
  coverImageUrl,
  content,
  fullAddress,
  letterImageUrl,
}: LetterBackData) => {
  const [pressedImage, setPressedImage] = useState<string | null>(null);

  const handleImagePress = (imageUrl: string) => {
    setPressedImage(imageUrl);
  };
  const handlePopupClose = () => {
    setPressedImage(null);
  };
  return (
    <View style={letterBackStyle.LetterBackWrapper}>
      <ImageBackground
        source={{uri: coverImageUrl}}
        resizeMode="cover"
        style={letterBackStyle.BackgroundImage}
        blurRadius={10}>
        <ScrollView style={letterBackStyle.LetterScrollWrapper}>
          <View style={letterBackStyle.LetterContentWrapper}>
            <Text style={letterBackStyle.DestinationHint}>{destinationHint}</Text>
            <Text style={letterBackStyle.FullAddress}>{fullAddress}</Text>
            <Text style={letterBackStyle.Content}>{content}</Text>

            {letterImageUrl.map((imageUrl, index) => {
              return (
                <TouchableOpacity
                  key={imageUrl + index}
                  onPress={() => {
                    handleImagePress(imageUrl);
                  }}>
                  <View style={letterBackStyle.ImageWrapper}>
                    <Image
                      source={{uri: imageUrl}}
                      style={letterBackStyle.Image}
                      borderRadius={10}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </ImageBackground>

      {pressedImage && <PopupImage imageUrl={pressedImage} onPressClose={handlePopupClose} />}
    </View>
  );
};

export default LetterBack;

// TODO : 편지 뒷면 이미지 클릭시 팝업 이미지
const PopupImage = ({imageUrl, onPressClose}: {imageUrl: string; onPressClose?: () => void}) => {
  return (
    <View style={popupImageStyle.PopupImageWrapper}>
      <TouchableOpacity onPress={onPressClose} style={popupImageStyle.Close}>
        <SvgIcon name="Close" style={popupImageStyle.CloseImage} />
      </TouchableOpacity>

      <View style={popupImageStyle.ImageWrapper}>
        <Image source={{uri: imageUrl}} style={popupImageStyle.Image} borderRadius={10} />
      </View>
    </View>
  );
};

const letterBackStyle = StyleSheet.create({
  LetterBackWrapper: {
    position: 'relative',
    height: '100%',
  },
  BackgroundImage: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  LetterScrollWrapper: {
    width: '100%',
  },
  LetterContentWrapper: {
    width: '90%',
    alignSelf: 'center',
    paddingTop: 47,
    paddingBottom: 50,
  },
  DestinationHint: {
    fontSize: 30,
    fontWeight: '700',
    color: 'white',
  },
  FullAddress: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginTop: 25,
  },
  Content: {
    fontSize: 16,
    fontWeight: '400',
    color: 'white',
    marginTop: 80,
  },
  ImageWrapper: {
    width: '90%',
    alignSelf: 'center',
  },
  Image: {
    width: '100%',
    height: 422,
    marginTop: 72,
  },
});

const popupImageStyle = StyleSheet.create({
  PopupImageWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: 'rgba(22, 21, 36, 0.9)',
    width: '100%',
    height: '100%',
  },
  ImageWrapper: {
    width: '90%',
    alignSelf: 'center',
    zIndex: 2,
  },
  Close: {
    position: 'absolute',
    top: 9,
    right: 24,
    width: 18,
    height: 18,
  },
  Image: {
    width: '100%',
    height: 427,
  },
  Blur: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  CloseImage: {
    width: '100%',
    height: '100%',
  },
});
