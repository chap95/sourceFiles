import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '@/styles/colors';
import fonts from '@/styles/fonts';
import {Bell, Geo, Picture, WhiteCamera} from '@/assets';
import {SigninParamList} from '@/types/navigation-types';
import {NavigationProp, useNavigation} from '@react-navigation/native';

function PermissionGuide() {
  const navigation = useNavigation<NavigationProp<SigninParamList>>();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <ScrollView>
        <View style={styles.headerWrapper}>
          <Text style={styles.guideHeader}>
            Seek 이용을 위해서
            {'\n'}
            아래의 권한이 필요해요!
          </Text>
        </View>
        <View style={styles.permissionGroupWrapper}>
          <Text style={styles.permissionGroupHeader}>필수 권한</Text>
          <View style={styles.permissionRowWrapper}>
            <View style={styles.roundView}>
              <Geo />
            </View>
            <View style={styles.permissionDescWrapper}>
              <Text style={styles.permissionDescHeader}>위치</Text>
              <Text style={styles.permissionDesc}>편지 열람 위치 설정 및 위치 도착 확인</Text>
            </View>
          </View>
          <View style={styles.permissionRowWrapper}>
            <View style={styles.roundView}>
              <Picture />
            </View>
            <View style={styles.permissionDescWrapper}>
              <Text style={styles.permissionDescHeader}>사진 보관함</Text>
              <Text style={styles.permissionDesc}>편지지 이미지 설정 및 편지 내 이미지 첨부</Text>
            </View>
          </View>
        </View>
        <View style={styles.permissionGroupWrapper}>
          <Text style={styles.permissionGroupHeader}>선택 권한</Text>
          <View style={styles.permissionRowWrapper}>
            <View style={styles.roundView}>
              <Bell />
            </View>
            <View style={styles.permissionDescWrapper}>
              <Text style={styles.permissionDescHeader}>알림</Text>
              <Text style={styles.permissionDesc}>편지 도착 및 장소 근접 알림</Text>
            </View>
          </View>
          <View style={styles.permissionRowWrapper}>
            <View style={styles.roundView}>
              <WhiteCamera />
            </View>
            <View style={styles.permissionDescWrapper}>
              <Text style={styles.permissionDescHeader}>카메라</Text>
              <Text style={styles.permissionDesc}>편지지 이미지 즉시 촬영</Text>
            </View>
          </View>
        </View>
        <View style={styles.confirmButtonWrapper}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignIn')}
            style={styles.confirmButtonActivationWrapper}>
            <Text style={styles.confirmButtonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg_6,
    height: Dimensions.get('window').height,
  },
  headerWrapper: {
    marginTop: 42,
    paddingHorizontal: 20,
  },
  guideHeader: {
    color: colors.text_1,
    fontSize: fonts.h2.fontSize,
    fontWeight: '700',
  },
  roundView: {
    width: 56,
    height: 56,
    borderRadius: 50,
    marginTop: 24,
    backgroundColor: colors.bg_5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionGroupWrapper: {
    marginTop: 64,
    paddingHorizontal: 20,
  },
  permissionGroupHeader: {
    fontSize: fonts.h3.fontSize,
    color: colors.text_1,
    fontWeight: '700',
  },
  permissionDescWrapper: {
    marginTop: 24,
    marginLeft: 22,
  },
  permissionRowWrapper: {
    flexDirection: 'row',
  },
  permissionDescHeader: {
    fontSize: fonts.body1.fontSize,
    fontWeight: '700',
    color: colors.text_1,
  },
  permissionDesc: {
    fontSize: fonts.body5.fontSize,
    fontWeight: '500',
    color: colors.text_1,
    marginTop: 10,
  },
  confirmButtonWrapper: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  confirmButtonActivationWrapper: {
    backgroundColor: colors.primary_default,
    borderRadius: 8,
    justifyContent: 'center',
    height: Dimensions.get('window').width / 8,
    width: Dimensions.get('window').width - 40,
  },
  confirmButtonTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.text_1,
    textAlign: 'center',
  },
});

export default PermissionGuide;
