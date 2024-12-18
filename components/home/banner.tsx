import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '@/styles/colors';
import fonts from '@/styles/fonts';

const bannerLists = [
  {id: '1', data: '우리 함께', data2: '걸었던 이 거리에서'},
  {id: '2', data: '나만 아는', data2: '비밀의 장소에서'},
  {id: '3', data: '우리 이번', data2: '데이트 장소에서'},
  {id: '4', data: '오늘 이곳을 지나갈', data2: '소중한 사람에게'},
  {id: '5', data: '함께 찾아갈 곳의', data2: '기대를 담아'},
  {id: '6', data: '우리 처음 만난', data2: '장소에서'},
]; // 배너 리스트

const Banner = ({mykey, data, data2}: {mykey: string; data: string; data2: string}) => {
  return (
    <View key={mykey} style={styles.slide1}>
      <Text style={styles.slideText}>{data}</Text>
      <Text style={styles.slideText}>{data2}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  slide1: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  slideText: {
    fontSize: fonts.h2.fontSize,
    fontWeight: '700',
    color: colors.text_1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export {Banner, bannerLists};
