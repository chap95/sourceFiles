/* eslint-disable react-native/no-inline-styles */
import {addressInfoState, isPressedSearchBarState} from '@/components/map/store/addressInfoState';
import {mapInfoSearchKeywordState} from '@/components/map/store/mapInfoSearchState';
import SvgIcon from '@/components/svgIcon';
import useCameraAndLibraryAndLocationPermission from '@/hooks/use-camera-library-location-permission';
import Mailing from '@/screens/mailing';
import ShareWithFriends from '@/screens/share-with-friends';
import WriteLetter1 from '@/screens/write-letter-1';
import WriteLetter1Map from '@/screens/write-letter-1-map';
import WriteLetter2 from '@/screens/write-letter-2';
import WriteLetterComplete from '@/screens/write-letter-complete';
import {writeLetterDataSelector} from '@/states';
import colors from '@/styles/colors';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSetRecoilState} from 'recoil';
import MapInfoSearchBar from '../components/map/MapInfoSearchBar';

const Stack = createNativeStackNavigator();

function WriteLetter() {
  const setWriteLetterData = useSetRecoilState(writeLetterDataSelector);
  const setAddressInfo = useSetRecoilState(addressInfoState);
  const setMapInfoSearchKeyword = useSetRecoilState(mapInfoSearchKeywordState);
  const setIsPressedSearchBar = useSetRecoilState(isPressedSearchBarState);
  useCameraAndLibraryAndLocationPermission();

  const handleOnClosePress = (navigation: any) => {
    setAddressInfo(null);
    setWriteLetterData(null);
    return navigation.navigate('HomeStack');
  };

  const handleOnXButtonPress = () => {
    setMapInfoSearchKeyword(null);
  };

  const handleSearchResultClose = () => {
    setIsPressedSearchBar(false);
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WriteLetter1"
        component={WriteLetter1}
        options={({navigation}) => ({
          title: '편지 작성 1/2',
          headerBackTitleVisible: false,
          headerTintColor: colors.text_1,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: colors.text_2,
            fontSize: 16,
            fontWeight: 'bold',
          },
          headerStyle: {backgroundColor: colors.bg_6},
          contentStyle: {
            borderTopColor: '#604DF2',
          },
          headerRight: () => (
            <Pressable
              onPress={() => handleOnClosePress(navigation)}
              style={{marginHorizontal: 15}}>
              <SvgIcon size={20} name={'Close'} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="WriteLetter2"
        component={WriteLetter2}
        options={({navigation}) => ({
          title: '편지 작성 2/2',
          headerBackTitleVisible: false,
          headerTintColor: colors.text_1,
          headerStyle: {backgroundColor: colors.bg_6},
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: colors.text_2,
            fontSize: 16,
            fontWeight: 'bold',
          },
          contentStyle: {
            borderTopColor: '#604DF2',
            borderTopWidth: 2,
          },
          headerRight: () => (
            <Pressable
              onPress={() => handleOnClosePress(navigation)}
              style={{marginHorizontal: 15}}>
              <SvgIcon size={20} name={'Close'} />
            </Pressable>
          ),
        })}
      />

      <Stack.Screen
        name="WriteLetter1Map"
        component={WriteLetter1Map}
        options={() => ({
          title: '',
          headerTitle: MapInfoSearchBar,
          headerBackTitleVisible: false,
          headerTintColor: colors.text_1,
          headerStyle: {backgroundColor: colors.bg_6},
          headerRight: () => (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 15,
              }}>
              <TouchableOpacity onPress={handleOnXButtonPress}>
                <SvgIcon size={16} name={'XCircleGray'} />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSearchResultClose}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: '700',
                    marginLeft: 20,
                  }}>
                  닫기
                </Text>
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="Mailing"
        component={Mailing}
        options={() => ({
          title: '편지 발송',
          headerBackTitleVisible: false,
          headerTintColor: colors.text_1,
          headerStyle: {backgroundColor: colors.bg_6},
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: colors.text_2,
            fontSize: 16,
            fontWeight: 'bold',
          },
        })}
      />
      <Stack.Screen
        name="ShareWithFriends"
        component={ShareWithFriends}
        options={() => ({
          title: '친구에게 공유하기',
          headerBackTitleVisible: false,
          headerTintColor: colors.text_1,
          headerStyle: {backgroundColor: colors.bg_6},
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: colors.text_2,
            fontSize: 16,
            fontWeight: 'bold',
          },
        })}
      />
      <Stack.Screen
        name="WriteLetterComplete"
        component={WriteLetterComplete}
        options={({route, navigation}) => ({
          title: '',
          headerShown: false,
          contentStyle: {
            backgroundColor: 'rgba(22, 21, 36, 0.8)',
          },
        })}
      />
    </Stack.Navigator>
  );
}
export default WriteLetter;

const writeLetterStepOneSearchAddressMap = StyleSheet.create({});
