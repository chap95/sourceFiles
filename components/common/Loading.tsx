import colors from '@/styles/colors';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Loading = ({text = '로딩중...'}: {text?: string}) => {
  return (
    <View style={loadingStyle.LoadingWrapper}>
      <Text style={loadingStyle.LoadingText}>{text}</Text>
    </View>
  );
};

export default Loading;

const loadingStyle = StyleSheet.create({
  LoadingWrapper: {
    height: '100%',
    backgroundColor: colors.bg_6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  LoadingText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
});
