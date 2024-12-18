/* eslint-disable react-hooks/exhaustive-deps */
import {throttle} from 'lodash';
import React, {useCallback, useEffect} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {isPressedSearchBarState} from './store/addressInfoState';
import {mapInfoSearchKeywordState} from './store/mapInfoSearchState';

const MapInfoSearchBar = () => {
  const [mapInfoSearchKeyword, setMapInfoSearchKeyword] = useRecoilState(mapInfoSearchKeywordState);
  const setIsPressedSearchBar = useSetRecoilState(isPressedSearchBarState);

  const handleOnChangeText = useCallback(
    (keyword: string) => {
      setMapInfoSearchKeyword(keyword);
    },
    [setMapInfoSearchKeyword],
  );

  const handleOnPress = () => {
    setIsPressedSearchBar(true);
  };

  useEffect(() => {
    return () => {
      setMapInfoSearchKeyword(null);
      setIsPressedSearchBar(false);
    };
  }, []);

  return (
    <View>
      <TextInput
        value={mapInfoSearchKeyword || undefined}
        placeholder="장소, 주소 입력"
        placeholderTextColor="#4A4C5D"
        onChangeText={throttle((text: string) => {
          handleOnChangeText(text);
        }, 1000)}
        onPressIn={handleOnPress}
        style={mapInfoSearchBarStyle.TextInput}
      />
    </View>
  );
};

export default MapInfoSearchBar;

const mapInfoSearchBarStyle = StyleSheet.create({
  TextInput: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
});
