import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {useCallback, useState} from 'react';
import {Alert} from 'react-native';

async function fetchUserLocation(userLocation: any) {
  const headers = {
    'X-NCP-APIGW-API-KEY-ID': '823ixeb1yk',
    'X-NCP-APIGW-API-KEY': 'FFgEdjCyZyfJgpgdD7CJBtAH8nyoUreQ5JL1PP94',
  };
  const {data} = await axios.get(
    'https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=' +
      `${userLocation.longitude},${userLocation.latitude}` +
      '&orders=legalcode,admcode,addr,roadaddr&output=json',
    {
      headers,
    },
  );

  return data;
}

function getUserLocation() {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log('현재 좌표 취득 성공');
        resolve({latitude, longitude});
      },
      error => {
        console.log('현재 좌표 취득 실패', error);
        Alert.alert('알림', '현재 좌표 취득 실패');
        reject(error);
      },
      {
        enableHighAccuracy: false, // true -> false로 하니 취득이 잘된다..
        timeout: 50000,
      },
    );
  });
}

export function useUserLocation() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const getCurrentLocation = useCallback(async () => {
    setIsLoading(true);
    let userLocation: any;
    let data: any;
    try {
      userLocation = await getUserLocation();
      data = await fetchUserLocation(userLocation);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
    return {data, userLocation};
  }, [setIsLoading]);

  return {
    isLoading,
    getCurrentLocation,
  };
}
