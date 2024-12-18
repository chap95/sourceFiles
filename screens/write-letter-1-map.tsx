/* eslint-disable react-native/no-inline-styles */
import WriteLetterStepOneMapPresenter from '@/components/writeLetter/WriteLetterStepOneMapPresenter';
import {useNavigation} from '@react-navigation/native';
import React from 'react';

function WriteLetter1Map() {
  const navigation = useNavigation();
  return <WriteLetterStepOneMapPresenter navigation={navigation} />;
}

export default WriteLetter1Map;
