import {writeLetterDataSelector} from '@/states/recoil-write-letter-state';
import colors from '@/styles/colors';
import React from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {addressInfoState} from './store/addressInfoState';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WIDNOW_HEIGHT = Dimensions.get('window').height;

const MapAddressContentContainer = ({navigation}: {navigation: any}) => {
  const addressInfo = useRecoilValue(addressInfoState);
  const setWriteLetterDataAddress = useSetRecoilState(writeLetterDataSelector);

  if (!addressInfo) {
    return <></>;
  }

  const {address, detailAddress, geoLocation} = addressInfo;

  const handleConfirmPress = () => {
    const {x, y} = geoLocation;

    setWriteLetterDataAddress({latitude: y, longitude: x, fullAddress: detailAddress});
    navigation.navigate('WriteLetter1');
  };

  return (
    <MapAddressContent
      addressName={address}
      addressDetail={detailAddress}
      handleConfirmPress={handleConfirmPress}
    />
  );
};

export default MapAddressContentContainer;

const MapAddressContent = ({
  addressName,
  addressDetail,
  handleConfirmPress,
}: {
  addressName: string;
  addressDetail: string;
  handleConfirmPress?: () => void;
}) => {
  // const naviagation = useNavigation<NavigationProp<any>>();

  return (
    <View style={mapAddressContentStyle.MapAddressContentWrapper}>
      <Text style={mapAddressContentStyle.addressName}>{addressName}</Text>
      <Text style={mapAddressContentStyle.addressDetail}>{addressDetail}</Text>

      <TouchableOpacity
        style={mapAddressContentStyle.writeLetterBtnActivationWrapper}
        onPress={handleConfirmPress}>
        <View style={mapAddressContentStyle.writeLetterTextWrapper}>
          <Text style={mapAddressContentStyle.writeLetterActivationText}>위치 지정 완료</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const mapAddressContentStyle = StyleSheet.create({
  MapAddressContentWrapper: {
    width: '100%',
    height: WIDNOW_HEIGHT * 0.4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingTop: 20,
    paddingRight: 20,
    paddingLeft: 20,
  },
  writeLetterBtnActivationWrapper: {
    backgroundColor: colors.primary_default,
    borderRadius: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    height: 52,
    width: '100%',
    marginTop: 32,
    marginBottom: 16,
  },
  writeLetterTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  writeLetterActivationText: {
    color: colors.text_1,
    fontWeight: '900',
    textAlign: 'center',
    marginLeft: 10,
  },
  addressName: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
    marginBottom: 12,
  },
  addressDetail: {
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
  },
});
