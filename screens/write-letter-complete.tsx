import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import colors from '@/styles/colors';
import fonts from '@/styles/fonts';

function WriteLetterComplete() {
  return (
    <View style={popupImageStyle.PopupImageWrapper}>
      <StatusBar barStyle={'light-content'} />
      <View style={popupImageStyle.ImageWrapper}>
        <FastImage
          source={require('@/assets/postbox.gif')}
          style={popupImageStyle.GifImage}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text style={popupImageStyle.Text1}>편지 발송 완료!</Text>
        <Text style={popupImageStyle.Text2}>소중한 편지 감사해요</Text>
      </View>
    </View>
  );
}

const popupImageStyle = StyleSheet.create({
  PopupImageWrapper: {
    // position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(22, 21, 36, 0.8)',
    width: '100%',
    height: '100%',
  },
  ImageWrapper: {
    width: '90%',
    alignSelf: 'center',
    zIndex: 2,
  },
  GifImage: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  Text1: {
    color: colors.text_1,
    fontSize: fonts.h3.fontSize,
    alignSelf: 'center',
  },
  Text2: {
    color: colors.text_2,
    fontSize: fonts.body4.fontSize,
    alignSelf: 'center',
  },
});
export default WriteLetterComplete;
