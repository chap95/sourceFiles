import colors from '@/styles/colors';
import {HomeParamList} from '@/types/navigation-types';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

const Error = ({text = '오류가 발생했어요.'}: {text?: string}) => {
  const navigation = useNavigation<NavigationProp<HomeParamList>>();

  const handleOnPress = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={errorStyle.ErrorWrapper}>
      <Text style={errorStyle.ErrorText}>{text}</Text>
      <Pressable style={errorStyle.ErrorButtonWrapper} onPress={handleOnPress}>
        <Text style={errorStyle.ErrorButtonText}>홈으로 이동</Text>
      </Pressable>
    </View>
  );
};

export default Error;

const errorStyle = StyleSheet.create({
  ErrorWrapper: {
    height: '100%',
    backgroundColor: colors.bg_6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ErrorText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  ErrorButtonWrapper: {
    width: '40%',
    height: 40,
    marginTop: 10,
    backgroundColor: colors.primary_default,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  ErrorButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
  },
});
