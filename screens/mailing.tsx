import {accessTokenState} from '@/states';
import colors from '@/styles/colors';
import fonts from '@/styles/fonts';
import {HomeParamList, WriteLetterParamList} from '@/types/navigation-types';
import {BASE_URL} from '@/utils/variables';
import {NavigationProp, RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import KakaoShareLink, {SendResultType} from '@utae/react-native-kakao-share-link';
import axios from 'axios';
import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useRecoilValue} from 'recoil';

type T = SendResultType;

function Mailing() {
  const route = useRoute<RouteProp<WriteLetterParamList, 'Mailing'>>();
  const navigation = useNavigation<NavigationProp<WriteLetterParamList>>();
  const homeNavigation = useNavigation<NavigationProp<HomeParamList>>();
  const {letterId, writerName, destinationHint, shareToken} = route.params;
  const [friendShareData, setFriendShareData] = useState(false);
  const currentAccessToken = useRecoilValue(accessTokenState);

  const getFriendsAxios = async () => {
    const {data} = await axios.get(`${BASE_URL}friends`, {
      headers: {
        Authorization: `Bearer ${currentAccessToken}`,
      },
    });
    return data;
  };

  const friendsQuery = useQuery(['friends_counts'], getFriendsAxios, {
    refetchOnWindowFocus: false, // react-query는 사용자가 사용하는 윈도우가 다른 곳을 갔다가 다시 화면으로 돌아오면 이 함수를 재실행합니다. 그 재실행 여부 옵션 입니다.
    retry: 1, // 실패시 재호출 몇번 할지
    onSuccess: data => {
      console.log('mailing friends_counts success');
      if (data.content.length > 0 && data.size > 0) {
        setFriendShareData(true);
      } else {
        setFriendShareData(false);
      }
    },
    onError: e => {
      console.log('mailing friends_counts error', e);
    },
    onSettled: () => {
      console.log('mailing friends_counts end');
    },
  });

  const kakaoShare = async () => {
    try {
      const kakaoShareParams = [
        {key: 'shareToken', value: `${shareToken}`},
        {key: 'id', value: letterId},
        {key: 'type', value: 'received'},
      ];

      const response = await KakaoShareLink.sendFeed({
        content: {
          title: '씩[SEEK] 편지 도착 알림 👉💌',
          // imageUrl: `${require('../assets/kakao-share.png')}`, // TODO: 씩서버에 부탁하는 방법
          imageUrl:
            'https://kr.object.ncloudstorage.com/letter-app-storage/common/letter-preview.png',
          imageHeight: 15,
          imageWidth: 30,
          link: {
            webUrl: 'test',
            mobileWebUrl: 'test',
          },
          description: `${writerName}님이\nSEEK에서 편지를 보냈어요!\n${destinationHint}에서\n내용을 확인해 보세요👣🕵️\n위치에 도착하시면 Seek이 알려드릴게요!`,
        },
        buttons: [
          {
            title: '편지 찾아가기',
            // TODO: deeplink 또는 App 설치 링크
            link: {
              androidExecutionParams: kakaoShareParams, // kakao{카카오 네이티브 앱키}://kakaolink?shareToken=`${shareToken}` 형식
              iosExecutionParams: kakaoShareParams, //
            },
          },
        ],
      });
      if (response) {
        homeNavigation.navigate('Home');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const friendShare = () => {
    navigation.navigate('ShareWithFriends', {letterId});
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <ScrollView>
        <View style={styles.wrapper1}>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>편지 발송을 위해</Text>
            <Text style={styles.title}>공유 방법을 선택해 주세요</Text>
          </View>
        </View>
        <View style={styles.wrapper2}>
          <View style={styles.shareWrapper}>
            {/* <View style={styles.shareItemWrapper}>
              <Pressable onPress={kakaoShare} style={styles.shareItemInnerWrapper}>
                <Image
                  source={require('@/assets/kakao-share.png')}
                  style={{width: 72, height: 72}}
                />
              </Pressable>
              <Text style={styles.shareText}>카카오톡 공유</Text>
            </View> */}
            <View style={styles.shareItemWrapper}>
              <Pressable
                onPress={friendShare}
                style={styles.shareItemInnerWrapper}
                disabled={!friendShareData}>
                {!friendShareData ? (
                  <Image
                    source={require('@/assets/friend-not-share.png')}
                    style={{width: 72, height: 72}}
                  />
                ) : (
                  <Image
                    source={require('@/assets/friend-share.png')}
                    style={{width: 72, height: 72}}
                  />
                )}
              </Pressable>
              <Text style={styles.shareText}>친구에게 공유</Text>
            </View>
          </View>
        </View>
        <View style={styles.wrapper3}>
          {!friendShareData ? (
            <View style={styles.explanationWrapper}>
              <Text style={styles.explanationText}>
                편지를 주고받은 이력이 있어야 친구에게 공유할 수{'\n'} 있습니다.카카오톡 공유하기를
                먼저 이용해 주세요!
              </Text>
            </View>
          ) : (
            ''
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg_6, height: Dimensions.get('window').height},
  wrapper1: {
    height: 65,
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    marginTop: 48,
  },
  wrapper2: {
    height: 250,
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    marginTop: 15,
  },
  wrapper3: {
    height: 90,
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    marginTop: 15,
  },
  titleWrapper: {},
  title: {
    color: colors.text_1,
    // fontFamily: fonts.h2.fontFamily,
    fontSize: fonts.h2.fontSize,
    fontWeight: 'bold',
    marginTop: 5,
  },
  shareWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    marginTop: 170,
  },
  shareItemWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareItemInnerWrapper: {
    borderRadius: 100,
  },
  shareText: {color: colors.text_1, fontSize: fonts.button3.fontSize, marginTop: 10},
  explanationWrapper: {
    backgroundColor: colors.bg_5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: '100%',
    paddingVertical: 15,
    marginTop: 15,
  },
  explanationText: {color: colors.text_4, fontSize: fonts.body4.fontSize},
});

export default Mailing;
