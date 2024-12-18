import MapItem from '@/components/map/mapItem';
import {MarkerCompo} from '@/components/map/marker';
import {RECEIVED_LETTER_API_KEY} from '@/hooks/letter/useReceivedLetterInfinite';
import useLocationPermission from '@/hooks/use-location-permission';
import {accessTokenState, nicknameState} from '@/states';
import fonts from '@/styles/fonts';
import {HomeParamList} from '@/types/navigation-types';
import getDistanceFromLatLonInKm from '@/utils/getDistanceFromLatLonInKm';
import {BASE_URL} from '@/utils/variables';
// import BottomSheet from 'reanimated-bottom-sheet';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import Geolocation from '@react-native-community/geolocation';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import NaverMapView, {Marker} from 'react-native-nmap';
import PushNotification from 'react-native-push-notification';
import {useRecoilValue} from 'recoil';

type letterType = {
  id: string;
  coverImageUrl: string;
  destinationHint: string;
  latitude: number;
  longitude: number;
  fullAddress: string;
  createdAt: string;
  isWriter: boolean;
  isLocked: boolean;
  isRead: boolean;
  writerName?: string;
};

//TODO: 전역관리
let _watchId: any;
function Map() {
  useLocationPermission();
  const homeNavigation = useNavigation<NavigationProp<HomeParamList>>();
  const [filterDataList, setFilterDataList] = useState([]);
  const [lettersDataList, setlettersDataList] = useState([]);
  const [myPosition, setMyPosition] = useState<{
    latitude: number;
    longitude: number;
  }>({latitude: 0, longitude: 0});
  const [myCurrentPosition, setMyCurrentPosition] = useState<{
    latitude: number;
    longitude: number;
  }>({latitude: 0, longitude: 0});

  const queryClient = useQueryClient();

  const currentAccessToken = useRecoilValue(accessTokenState);
  const nickname = useRecoilValue(nicknameState);
  // 편지 목록 받아오기 API 호출
  const getLettersAxios = async () => {
    const {data} = await axios.get(`${BASE_URL}letters`, {
      headers: {
        Authorization: `Bearer ${currentAccessToken}`,
      },
    });
    return data;
  };
  const {isLoading, error, data, refetch} = useQuery(['letters'], getLettersAxios, {
    refetchOnWindowFocus: false, // react-query는 사용자가 사용하는 윈도우가 다른 곳을 갔다가 다시 화면으로 돌아오면 이 함수를 재실행합니다. 그 재실행 여부 옵션 입니다.
    retry: 1, // 실패시 재호출 몇번 할지
    onSuccess: SuccessData => {
      console.log('map /letters api success');
      setlettersDataList(SuccessData);
    },
    onError: e => {
      console.log('map /letters api error', e);
    },
    onSettled: () => {
      console.log('map /letters api end');
    },
  });

  // 마커 클릭 시, 1. bottomsheet 200으로 표시  2. 해당 마커 위도,경도 취득  3. 받아 온 편지들 목록에서 선택한 편지 위도,경도가 같은 것을 따로 배열로 만듬.
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [86, 300, 600], []);
  const markerSelectHandler = (letterData: letterType) => {
    sheetRef.current?.snapToIndex(1);
    const latitude: number = letterData?.latitude; // 선택한 편지 위도
    const longitude: number = letterData?.longitude; // 선택한 편지 경도
    setFilterDataList(
      lettersDataList.filter(
        (letter: letterType) => letter.latitude === latitude && letter.longitude === longitude,
      ),
    );
  };

  // bottomsheet의 편지를 클릭 시, 1. bottomsheet를 200으로 표시  2.편지 앞면으로 이동
  //TODO: 1. rock인 상태의 편지로 이동(param 전달?)
  const unlockOfFirst = useRef<string[]>([]);
  const handleOnPress = useCallback(
    ({id, writerName}: {id: string; writerName: string}) => {
      sheetRef.current?.snapToIndex(0);
      if (unlockOfFirst.current.includes(id)) {
        homeNavigation.navigate('ReadFrontLetter', {
          id: id,
          writerName: writerName,
          type: 'unlock',
        });
        const index = unlockOfFirst.current.indexOf(id);
        if (index > -1) {
          unlockOfFirst.current.splice(index, 1);
          homeNavigation.navigate('ReadFrontLetter', {
            id: id,
            writerName: writerName,
            type: 'received',
          });
        }
      } else {
        homeNavigation.navigate('ReadFrontLetter', {
          id: id,
          writerName: writerName,
          type: 'received',
        });
      }
    },
    [homeNavigation],
  );
  // bottomsheet의 편지들의 편지 컴포넌트
  const renderItems = useCallback(
    ({item, index}: any) => {
      const {id, writerName} = item;

      return (
        <MapItem
          key={`${item.id}_${index}`}
          content={item}
          handleOnpress={() => {
            handleOnPress({id: id, writerName: writerName});
          }}
          width={'100%'}
        />
      );
    },
    [handleOnPress],
  );

  // 1. 25m마다 현재 위치를 가져온다. 2. 현재 좌표랑 편지들의 위도,경도랑 비교 한다. 3. 거리를 구하는 유틸을 만들어서 50m 이내인 경우, 알림을 보낸다.
  const before50mDataFunc = useCallback(
    (letter: letterType) => {
      console.log('before50mDataFunc letter', letter.id);
      console.log('50m이내 편지가 있을 떄,실행');

      PushNotification.localNotification({
        channelId: 'letters-50m',
        title: '편지 근처 도착',
        message: `근처에 ${nickname}님이\n읽을 수 있는 편지가 있어요 주위를 둘러보세요.👀`,
      });
    },
    [nickname],
  );

  // 1. 25m마다 현재 위치를 가져온다. 2. 현재 좌표랑 편지들의 위도,경도랑 비교 한다. 3. 거리를 구하는 유틸을 만들어서 25m 이내인 경우, 잠금을 해제하고 알림을 보낸다.
  const before25mDataFunc = useCallback(
    (letter: letterType) => {
      console.log('before25mDataFunc letter', letter.id);
      console.log('25m이내 편지가 있을 떄,실행');
      // 잠김을 해제함
      try {
        const patchLetterUnlock = async () => {
          await axios.patch(`${BASE_URL}letters/${letter.id}/unlock`, null, {
            headers: {
              Authorization: `Bearer ${currentAccessToken}`,
            },
          });
        };
        patchLetterUnlock().then(() => {
          console.log('### [invalid received letter]');
          queryClient.invalidateQueries([RECEIVED_LETTER_API_KEY]);
        });
      } catch (e) {
        console.log('/letters/letterId/unlock', e);
      }

      // 데이터 리프레쉬
      refetch();

      PushNotification.localNotification({
        channelId: 'letters-25m',
        title: '편지 열람 가능',
        message: `지금 ${nickname}님이 읽을 수 있는 편지를 찾았\n어요.발자국을 눌러 편지를 열어 보세요.👣`,
      });
    },
    [currentAccessToken, nickname, queryClient, refetch],
  );

  //현재 위재 취득 FIXME: 위치권한 허용 후, 현재좌표가 여려번 취득되는 경우를 해결 못함.
  useEffect(() => {
    _watchId = Geolocation.watchPosition(
      info => {
        console.log('### [set my position]');
        setMyPosition({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
      },
      console.error,
      {
        enableHighAccuracy: true,
        timeout: 20000,
        distanceFilter: 10, // 10m정도 움직였을 때, 다시한번 현재 위치를 가져와준다.
      },
    );

    return () => {
      if (_watchId) {
        Geolocation.clearWatch(_watchId);
      }
    };
  }, [setMyPosition]);

  const mapRef = useRef<NaverMapView>(null);
  const animateToMarker = useCallback(() => {
    if (myCurrentPosition.latitude === 0 && myCurrentPosition.latitude === 0) {
      return;
    }
    // Marker의 위치를 가져옵니다.
    const markerCoordinate = myCurrentPosition;
    // const region: Region = {
    //   latitude: myCurrentPosition.latitude,
    //   longitude: myCurrentPosition.longitude,
    // };
    // animateToCoordinate 메소드를 사용하여 지도 화면을 이동합니다.
    if (mapRef.current) {
      mapRef.current.animateToCoordinate(markerCoordinate);
    }
  }, [myCurrentPosition]);

  const getUserLocation = useCallback(() => {
    // 현재위치 클릭했을 때, 현재 좌표 한번만 가져오기
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          resolve({latitude, longitude});
        },
        errorLocation => {
          console.log('현재 좌표 취득 실패', errorLocation);
          Alert.alert('알림', '현재 좌표 취득 실패');
          reject(errorLocation);
        },
        {
          enableHighAccuracy: false, // true -> false로 하니 취득이 잘된다..
          timeout: 50000,
        },
      );
    });
  }, []);

  const currentLocation = useCallback(async () => {
    const userLocation: any = await getUserLocation();
    setMyCurrentPosition(userLocation);
    //현재 위치로 지도 이동
    animateToMarker();
  }, [getUserLocation, animateToMarker]);

  const mounted = useRef(false);
  const before50mDataRefs = useRef<string[]>([]); //FIXME: 임시로 복수 렌더링 떄문에 추가.
  const before25mDataRefs = useRef<string[]>([]); //FIXME: 임시로 복수 렌더링 떄문에 추가.
  useEffect(() => {
    if (!mounted.current) {
      //마운트 될떄는 실행x ,업데이트될 때만 실행o
      mounted.current = true;
    } else {
      //현재 위치로 지도 이동
      // currentLocation();
      //현재 좌표랑 편지들의 위도,경도랑 비교 한다.
      lettersDataList?.forEach((letter: letterType, index: number) => {
        const distance = Number(
          getDistanceFromLatLonInKm(
            myPosition.latitude,
            myPosition.longitude,
            letter.latitude,
            letter.longitude,
          ).toFixed(3),
        );

        //1.rock이 걸려 있는 상태만 알람 실행. 2.전에 25m알람이 있을경우 실행 x
        if (letter.isLocked && !before25mDataRefs.current.includes(letter.id)) {
          if (distance < 0.025) {
            before25mDataFunc(letter);
            before25mDataRefs.current.push(letter.id);
            unlockOfFirst.current.push(letter.id);
          } else if (
            distance > 0.025 &&
            distance < 0.05 &&
            !before50mDataRefs.current.includes(letter.id)
          ) {
            before50mDataFunc(letter);
            before50mDataRefs.current.push(letter.id);
          }
        }
      });
    }
  }, [lettersDataList, myPosition, before50mDataFunc, before25mDataFunc]);

  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <NaverMapView
        ref={mapRef}
        style={styles.naverMapView}
        showsMyLocationButton={false}
        zoomControl={false}>
        <Marker
          coordinate={myCurrentPosition}
          width={28}
          height={28}
          image={require('@/assets/myLocation.png')}
        />
        {lettersDataList?.map((letter: letterType, index: number) => {
          // filter 함수를 사용하여 id와 일치하는 요소만 선택합니다.
          const count = lettersDataList.filter(
            (item: any) =>
              letter.latitude === item.latitude &&
              letter.longitude === item.longitude &&
              !item.isWriter,
          ).length;
          return letter.isWriter ? (
            ''
          ) : (
            <MarkerCompo
              key={letter.id}
              mykey={letter.id}
              latitude={letter.latitude}
              longitude={letter.longitude}
              onpress={() => markerSelectHandler(letter)}
              countLetters={count}
            />
          );
        })}
      </NaverMapView>
      {/* <Portal></Portal> */}
      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        handleIndicatorStyle={{display: 'none'}}
        backgroundComponent={() => <View />}>
        <View style={styles.bottomSheetTitleButtonWrapper}>
          <Pressable onPress={currentLocation}>
            <Image
              source={require('@/assets/myLocation-button.png')}
              style={{width: 62, height: 62}}
            />
          </Pressable>
        </View>
        <Text style={styles.bottomSheetTitle}>편지 목록</Text>
        <BottomSheetFlatList
          data={filterDataList}
          renderItem={renderItems}
          style={styles.contentContainer}
        />
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bottomSheetTitleButtonWrapper: {
    height: 66,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  bottomSheetTitle: {
    height: 30,
    fontSize: fonts.h4.fontSize,
    fontWeight: '900',
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  naverMapView: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});

export default Map;
