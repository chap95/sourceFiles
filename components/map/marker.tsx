import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Marker} from 'react-native-nmap';

const MarkerCompo = ({
  mykey,
  latitude,
  longitude,
  onpress,
  countLetters,
}: {
  mykey: string;
  latitude: number;
  longitude: number;
  onpress: any;
  countLetters: number;
}) => {
  return (
    //TODO: 마커위에 숫자
    <Marker
      key={mykey}
      coordinate={{latitude, longitude}}
      image={require('@/assets/foot.png')}
      onClick={onpress}
      width={40}
      height={40}
      caption={
        String(countLetters) === '1' ? {text: ''} : {text: String(countLetters), color: '#604DF2'}
      }
    />
  );
};

export {MarkerCompo};
