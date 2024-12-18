import React from 'react';
import {useRecoilValue} from 'recoil';
import MapInfoSearchingResult from '../map/MapInfoSearchingResult';
import {isPressedSearchBarState} from '../map/store/addressInfoState';
import WriteLetterStepOneMap from './WriteLetterStepOneMap';

const WriteLetterStepOneMapPresenter = ({navigation}: {navigation: any}) => {
  const isPressedSearchBar = useRecoilValue(isPressedSearchBarState);

  if (isPressedSearchBar) {
    return <MapInfoSearchingResult />;
  }

  return <WriteLetterStepOneMap navigation={navigation} />;
};

export default WriteLetterStepOneMapPresenter;
