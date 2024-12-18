import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SvgIcon from '../svgIcon';

const Unlock = () => {
  return (
    <View style={UnlockStyle.UnlockWrapper}>
      <View style={UnlockStyle.ContentWrapper}>
        <SvgIcon name="LockOpen" width={180} height={180} />
        <Text style={UnlockStyle.LabelPrimary}>편지 잠금.. 해제!</Text>
        <Text style={UnlockStyle.LabelSecondary}>이제 어디서든 읽을 수 있어요</Text>
      </View>
    </View>
  );
};

export default Unlock;

const UnlockStyle = StyleSheet.create({
  UnlockWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 999,
    backgroundColor: 'rgba(0,0,0,0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ContentWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  LabelPrimary: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  LabelSecondary: {
    fontSize: 14,
    fontWeight: '500',
    color: '#CCCCCC',
    marginTop: 8,
  },
});
