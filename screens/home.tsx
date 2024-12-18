/* eslint-disable @typescript-eslint/no-shadow */
import {Banner, bannerLists} from '@/components/home/banner';
import SvgIcon from '@/components/svgIcon';
import {useLettersCounts} from '@/hooks/letter/useLettersCounts';

import {UserInfoResponse, useUserInfo} from '@/hooks/user/useUserInfo';
import {nicknameState, profileImageUrlState} from '@/states';
import colors from '@/styles/colors';
import fonts from '@/styles/fonts';
import {HomeParamList} from '@/types/navigation-types';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Swiper from 'react-native-swiper';
import {useRecoilState, useSetRecoilState} from 'recoil';

type lettersCounts = {
  sendLetterCount: number;
  receiveLetterCount: number;
};

function Home() {
  const navigation = useNavigation<NavigationProp<HomeParamList>>();
  const [nicknameRecoil, setNicknameRecoil] = useRecoilState(nicknameState);
  const setProfileImageUrlRecoil = useSetRecoilState(profileImageUrlState);

  const handleUserInfoSuccess = (data?: UserInfoResponse) => {
    if (data) {
      setNicknameRecoil(data.name);
      setProfileImageUrlRecoil(data.profileImageUrl);
    }
  };

  const {data: lettersCounts} = useLettersCounts();
  const {data: _} = useUserInfo({onSuccessHandler: handleUserInfoSuccess});

  const {receiveLetterCount, sendLetterCount} = lettersCounts ?? {};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <ScrollView>
        <View style={styles.cardWrapper}>
          <TouchableOpacity
            onPress={() => navigation.navigate('MailboxTopTab')}
            style={styles.cardInnerWrapper}>
            <View style={styles.textWrapper}>
              <View style={styles.textRowWrapper}>
                <Text style={styles.text1}>{nicknameRecoil}</Text>
                <Text style={styles.text1}>의</Text>
              </View>
              <View style={[styles.textRowWrapper, styles.textRow2OuterWrapper]}>
                <Text style={styles.text2}>편지함</Text>
                <SvgIcon name={'ChevronRight'} />
              </View>
              <View style={[styles.textRowWrapper, styles.textRow3OuterWrapper]}>
                <View style={[styles.textRowWrapper, styles.textRow3Margin]}>
                  <Text style={styles.text3}>보낸 편지</Text>
                  <Text style={styles.text3}>{sendLetterCount ?? 0}</Text>
                </View>
                <View style={styles.textRowWrapper}>
                  <Text style={styles.text3}>받은 편지</Text>
                  <Text style={styles.text3}>{receiveLetterCount ?? 0}</Text>
                </View>
              </View>
            </View>
            <View style={styles.iconWrapper}>
              <SvgIcon name={'Rock'} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.rollingWrapper}>
          <View style={styles.letterWrapper}>
            <SvgIcon name={'LetterHome'} size={200} />
          </View>
          <View style={styles.swiperWrapper}>
            <Swiper autoplay showsPagination={false} width={250} height={150} autoplayTimeout={2}>
              {bannerLists.map(banner => {
                return (
                  <Banner
                    key={banner.id}
                    mykey={banner.id}
                    data={banner.data}
                    data2={banner.data2}
                  />
                );
              })}
            </Swiper>
          </View>
        </View>
      </ScrollView>

      <SvgIcon name="Tooltip" width={104} height={43} style={styles.tooptip} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg_6, position: 'relative'},
  cardWrapper: {
    height: 152,
    backgroundColor: colors.bg_5,
    borderRadius: 15,
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInnerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 15,
    height: '100%',
    width: '100%',
  },
  textWrapper: {},
  textRowWrapper: {flexDirection: 'row', alignItems: 'center'},
  textRow2OuterWrapper: {marginTop: 5},
  textRow3OuterWrapper: {marginTop: 15},
  textRow3Margin: {marginRight: 15},
  text1: {color: colors.text_4},
  text2: {color: colors.text_1, fontSize: fonts.h3.fontSize, fontWeight: '700'},
  text3: {color: colors.text_2, fontSize: fonts.body4.fontSize, marginRight: 3},
  tooptip: {
    position: 'absolute',
    bottom: 12,
    left: '50%',
    transform: [
      {
        translateX: (104 / 2) * -1,
      },
    ],
  },
  iconWrapper: {backgroundColor: colors.bg_4, borderRadius: 100},
  rollingWrapper: {
    flex: 2,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingBottom: 35,
  },
  letterWrapper: {
    flex: 4,
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  swiperWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default Home;
