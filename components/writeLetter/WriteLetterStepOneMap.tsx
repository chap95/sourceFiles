import {Portal} from '@gorhom/portal';
import React, {useEffect, useRef} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import NaverMapView, {Marker} from 'react-native-nmap';
import BottomSheet from 'reanimated-bottom-sheet';
import {useRecoilValue} from 'recoil';
import MapAddressContentContainer from '../map/MapAddressContent';
import {addressInfoState} from '../map/store/addressInfoState';

const WriteLetterStepOneMap = ({navigation}: {navigation: any}) => {
  const sheetRef = useRef<BottomSheet>(null);
  const naverMapViewRef = useRef<NaverMapView>(null);
  const addressInfo = useRecoilValue(addressInfoState);

  useEffect(() => {
    if (addressInfo && naverMapViewRef.current) {
      naverMapViewRef.current.animateToCoordinate({
        longitude: addressInfo.geoLocation.x,
        latitude: addressInfo.geoLocation.y,
      });
    }
  }, [addressInfo]);

  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <NaverMapView
        style={writeLetterStepOneMapStyle.NaverMap}
        showsMyLocationButton={false}
        zoomControl={false}
        onMapClick={() => sheetRef.current?.snapTo(0)}
        ref={naverMapViewRef}>
        {addressInfo ? (
          <Marker
            image={require('@/assets/position-pin.png')}
            width={56}
            height={56}
            coordinate={{
              longitude: addressInfo.geoLocation.x,
              latitude: addressInfo.geoLocation.y,
            }}
          />
        ) : (
          <View />
        )}
      </NaverMapView>
      <Portal>
        <BottomSheet
          ref={sheetRef}
          initialSnap={0}
          snapPoints={[200, 0]}
          renderContent={() => {
            return <MapAddressContentContainer navigation={navigation} />;
          }}
        />
      </Portal>
    </SafeAreaView>
  );
};

export default WriteLetterStepOneMap;

const writeLetterStepOneMapStyle = StyleSheet.create({
  NaverMap: {
    width: '100%',
    height: '100%',
  },
});
