/* eslint-disable react-native/no-inline-styles */
import useSearchingMapInfoByAddress, {
  RefinedMapInfo,
} from '@/hooks/searchMapInfo/useSearchingMapInfo';
import colors from '@/styles/colors';
import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import SvgIcon from '../svgIcon';
import {addressInfoState, isPressedSearchBarState} from './store/addressInfoState';
import {mapInfoSearchKeywordState} from './store/mapInfoSearchState';

const MapInfoSearchingResult = () => {
  const mapInfoSearchKeyword = useRecoilValue(mapInfoSearchKeywordState);
  const setIsPressedSearchBar = useSetRecoilState(isPressedSearchBarState);
  const setAddressInfo = useSetRecoilState(addressInfoState);

  const {data, isLoading} = useSearchingMapInfoByAddress({
    query: mapInfoSearchKeyword,
  });

  if (isLoading) {
    return (
      <View style={mapInfoSearchingResultStyle.Wrapper}>
        <Text style={mapInfoSearchingResultStyle.Text}>주소목록 조회중...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={mapInfoSearchingResultStyle.Wrapper}>
        <Text style={mapInfoSearchingResultStyle.Text}>검색 결과 없음...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={mapInfoSearchingResultStyle.ResultWrapper}>
      {data.map((document, index) => {
        return (
          <MapInfoSearchingResultItem
            key={`MapInfoSearchingResultItem_${index}`}
            data={document}
            onClickItem={value => {
              setIsPressedSearchBar(false);
              setAddressInfo({
                address: value.addressName,
                detailAddress: value.detailAddress,
                geoLocation: {
                  x: value.x,
                  y: value.y,
                },
              });
            }}
          />
        );
      })}
    </ScrollView>
  );
};

export default MapInfoSearchingResult;

const mapInfoSearchingResultStyle = StyleSheet.create({
  ResultWrapper: {
    height: '100%',
    backgroundColor: colors.bg_5,
    paddingBottom: 30,
  },
  Wrapper: {
    height: '100%',
    justifyContent: 'center',
    backgroundColor: colors.bg_5,
  },
  Text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    alignSelf: 'center',
  },
});

const MapInfoSearchingResultItem = ({
  data,
  onClickItem,
}: {
  data: RefinedMapInfo;
  onClickItem?: (value: {addressName: string; detailAddress: string; x: number; y: number}) => void;
}) => {
  const {addressPrimary, addressSecondary, x, y} = data;

  return (
    <TouchableOpacity
      onPress={() => {
        if (onClickItem) {
          onClickItem({
            addressName: addressPrimary,
            detailAddress: addressSecondary,
            x,
            y,
          });
        }
      }}>
      <View style={addressSearchResultStyle.ResultWrapper}>
        <View style={addressSearchResultStyle.ImageWrapper}>
          <SvgIcon
            name="LocationPin"
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </View>

        <View style={addressSearchResultStyle.InfoWrapper}>
          <Text style={addressSearchResultStyle.AddressName}>{addressPrimary}</Text>
          <Text style={addressSearchResultStyle.AddressDetail}>{addressSecondary}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const addressSearchResultStyle = StyleSheet.create({
  ResultWrapper: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    marginTop: 28,
    alignSelf: 'center',
    justifyContent: 'flex-start',
    height: 40,
  },
  ImageWrapper: {
    width: 18,
    height: 18,
    marginRight: 12,
  },
  InfoWrapper: {
    justifyContent: 'center',
  },
  AddressName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 1,
  },
  AddressDetail: {
    color: colors.text_4,
    fontSize: 14,
    fontWeight: '500',
  },
});
