import colors from '@/styles/colors';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SvgIcon from '../svgIcon';

const Empty = () => {
  return (
    <View style={{...EmptyStyle.EmptyWrapper}}>
      <View style={EmptyStyle.EmptyInnerWrapper}>
        <SvgIcon name="PostBoxSpring" />
        <Text style={EmptyStyle.EmptyText}>편지함이 비었어요</Text>
      </View>
    </View>
  );
};

export default Empty;

const EmptyStyle = StyleSheet.create({
  EmptyWrapper: {
    width: 200,
    height: 200,
  },
  EmptyInnerWrapper: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg_6,
  },
  EmptyText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text_4,
  },
});
