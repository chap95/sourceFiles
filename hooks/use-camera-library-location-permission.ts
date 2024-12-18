import {useEffect} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

function useCameraAndLibraryAndLocationPermission() {
  useEffect(() => {
    // 위치
    if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then(result => {
          if (result === RESULTS.BLOCKED || result === RESULTS.DENIED) {
            Alert.alert(
              '이 앱은 위치 권한 허용이 필요합니다.',
              '앱 설정 화면을 열어서 항상 허용으로 바꿔주세요.',
              [
                {
                  text: '네',
                  onPress: () => Linking.openSettings(),
                  style: 'default',
                },
                {
                  text: '아니오',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel',
                },
              ],
            );
          }
        })
        .catch(console.error);
    } else if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then(result => {
          if (
            result === RESULTS.DENIED ||
            result === RESULTS.LIMITED ||
            result === RESULTS.GRANTED
          ) {
            return request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
          } else {
            console.log(result);
            promptForLocationPermission();
          }
        })
        .catch(console.error);
    }
    // 카메라
    if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.CAMERA)
        .then(result => {
          if (result === RESULTS.DENIED || result === RESULTS.GRANTED) {
            return request(PERMISSIONS.ANDROID.CAMERA);
          } else {
            console.log(result);
            // throw new Error('카메라 지원 안 함');
          }
        })
        .catch(console.error);
    } else if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.CAMERA)
        .then(result => {
          if (
            result === RESULTS.DENIED ||
            result === RESULTS.LIMITED ||
            result === RESULTS.GRANTED
          ) {
            return request(PERMISSIONS.IOS.CAMERA);
          } else {
            promptForCameraPermission();
            console.log('result', result);
          }
        })
        .catch(console.error);
    }
    // 사진첩
  }, []);

  const promptForCameraPermission = () => {
    Alert.alert(
      "'Seek'이(가) 카메라에 접근권한이 거부되어 있습니다.",
      '수동 권한 확인 버튼을 누르면 디바이스 설정에서 권한을 직접세팅할 수 있습니다.',
      [
        {
          text: '허용 안 함',
        },
        {
          text: '수동 권한 확인',
          onPress: () => Linking.openSettings(),
        },
      ],
    );
  };
  const promptForLocationPermission = () => {
    Alert.alert(
      "'Seek'이(가) 위치 접근권한이 거부되어 있습니다.",
      '수동 권한 확인 버튼을 누르면 디바이스 설정에서 권한을 직접세팅할 수 있습니다.',
      [
        {
          text: '허용 안 함',
        },
        {
          text: '수동 권한 확인',
          onPress: () => Linking.openSettings(),
        },
      ],
    );
  };
}

export default useCameraAndLibraryAndLocationPermission;
