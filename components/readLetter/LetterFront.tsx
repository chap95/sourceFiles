import colors from '@/styles/colors';
import React, {useEffect, useMemo, useState} from 'react';
import {ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Unlock from './Unlock';

export interface LetterFrontData {
  destinationHint: string;
  fullAddress: string;
  coverImageUrl: string;
  isLocked?: boolean;
  isRead?: boolean;
  isUnlock?: boolean;
  onPressReadLetterButton: () => void;
}

const LetterFront = (props: LetterFrontData) => {
  const {
    destinationHint,
    fullAddress,
    coverImageUrl,
    isLocked,
    isUnlock = false,
    onPressReadLetterButton,
  } = props;

  const [isShowUnlock, setIsShowUnlock] = useState<boolean>(isUnlock);

  const buttonStyle = useMemo(() => {
    if (isLocked) {
      return {
        ...letterFrontStyle.Button,
        ...letterFrontStyle.ButtonDisabled,
      };
    }

    return {
      ...letterFrontStyle.Button,
      ...letterFrontStyle.ButtonEnabled,
    };
  }, [isLocked]);

  useEffect(() => {
    let timeout: any;

    if (isUnlock) {
      timeout = setTimeout(() => {
        setIsShowUnlock(false);
      }, 1500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isUnlock]);

  return (
    <View style={letterFrontStyle.LetterFrontWrapper}>
      {isShowUnlock && <Unlock />}
      {Platform.OS === 'android' ? <View style={letterFrontStyle.BackgroundDim} /> : ''}
      <ImageBackground
        source={{uri: coverImageUrl}}
        resizeMode="cover"
        style={letterFrontStyle.CoverImage}>
        <View style={letterFrontStyle.LetterInfoWrapper}>
          <Text style={letterFrontStyle.DestinationHint}>{destinationHint}</Text>
          <Text style={letterFrontStyle.FullAddress}>{fullAddress}</Text>

          <TouchableOpacity onPress={onPressReadLetterButton}>
            <View style={letterFrontStyle.ButtonWrapper}>
              <View style={buttonStyle}>
                <Text style={letterFrontStyle.ButtonText}>
                  {isLocked ? '아직 편지를 열 수 없어요. 더 가까이 가보세요!' : '편지 읽기'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default LetterFront;

const letterFrontStyle = StyleSheet.create({
  LetterFrontWrapper: {
    position: 'relative',
    height: '100%',
    zIndex: 1,
  },
  BackgroundDim: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 2,
  },
  CoverImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  LetterInfoWrapper: {
    width: '90%',
    alignSelf: 'center',
    zIndex: 3,
  },
  DestinationHint: {
    fontSize: 30,
    fontWeight: '700',
    color: 'white',
    marginBottom: 25,
    zIndex: 3,
  },
  FullAddress: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: 72,
    zIndex: 3,
  },
  ButtonWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  Button: {
    width: '100%',
    height: 52,

    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ButtonEnabled: {
    backgroundColor: colors.primary_default,
  },
  ButtonDisabled: {
    backgroundColor: colors.bg_6,
  },
  ButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
});
