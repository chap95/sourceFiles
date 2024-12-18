import {useState, useEffect} from 'react';
import {getModel} from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import {phoneInfoState} from '@/states';
import {useRecoilState} from 'recoil';

const usePhoneInfo = () => {
  const [phoneInfo, setPhoneInfo] = useRecoilState(phoneInfoState);

  useEffect(() => {
    const getInfo = async () => {
      if (!messaging().isDeviceRegisteredForRemoteMessages) {
        await messaging().registerDeviceForRemoteMessages();
      }
      const token = await messaging().getToken();
      const model = await getModel();
      setPhoneInfo({token, model});
    };
    getInfo();
  }, [setPhoneInfo]);

  return phoneInfo;
};

export default usePhoneInfo;
