/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
import {LetterReportIcon} from '@/components/readLetter/LetterReport';
import {isShowLetterReportIconState} from '@/components/readLetter/LetterReportState';
import SvgIcon from '@/components/svgIcon';
import usePrevScreen from '@/hooks/usePrevScreen';
import MailboxTopTab from '@/navigator/mailbox-top-tab';
import Alarm from '@/screens/alarm';
import Home from '@/screens/home';
import ReadBackLetter from '@/screens/read-back-letter';
import ReadFrontLetter from '@/screens/read-front-letter';
import {stackNavigateParamsState} from '@/states/stackNavigateParamsState';
import colors from '@/styles/colors';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Pressable, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useRecoilValue} from 'recoil';

const Stack = createNativeStackNavigator();

function HomeStack() {
  const isShowLetterReportIcon = useRecoilValue(isShowLetterReportIconState);

  return (
    <Stack.Navigator
      screenOptions={({navigation}) => ({
        headerTintColor: colors.text_1,
        headerStyle: {backgroundColor: colors.bg_6},
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: colors.text_2,
          fontSize: 16,
          fontWeight: 'bold',
        },
        headerLeft: () => <CustomBackButton navigation={navigation} />,
        headerRight: () => (
          <View style={{flexDirection: 'row'}}>
            <Pressable onPress={() => navigation.navigate('Alarm')} style={{marginHorizontal: 15}}>
              <SvgIcon size={20} name={'Alarm'} />
            </Pressable>
            <Pressable onPress={() => navigation.openDrawer()} style={{marginHorizontal: 10}}>
              <SvgIcon size={20} name={'ThreeDots'} />
            </Pressable>
          </View>
        ),
      })}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{title: '홈', headerTitleAlign: 'left', headerLeft: undefined}}
      />
      <Stack.Screen
        name="Alarm"
        component={Alarm}
        options={() => ({
          title: '알림',
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
          headerTintColor: colors.text_1,
          headerStyle: {backgroundColor: colors.bg_6},
          headerRight: () => <View />,
        })}
      />
      <Stack.Screen
        name="MailboxTopTab"
        component={MailboxTopTab}
        options={{
          title: '편지함',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: colors.text_2,
            fontSize: 16,
            fontWeight: '500',
          },
        }}
      />
      <Stack.Screen
        name="ReadFrontLetter"
        component={ReadFrontLetter}
        options={{
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: colors.text_2,
            fontSize: 16,
            fontWeight: '500',
          },
          headerRight: () => (isShowLetterReportIcon ? <LetterReportIcon /> : <View />),
        }}
      />
      <Stack.Screen
        name="ReadBackLetter"
        component={ReadBackLetter}
        options={{
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: colors.text_2,
            fontSize: 16,
            fontWeight: '500',
          },
          headerRight: () => <View />,
        }}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;

export const CustomBackButton = ({navigation}: {navigation: any}) => {
  const prevScreen = usePrevScreen();
  const navigateParams = useRecoilValue(stackNavigateParamsState);

  const handleOnPress = () => {
    if (prevScreen?.name) {
      return navigation.navigate(prevScreen.name, navigateParams ?? {});
    } else {
      return navigation.navigate('Home');
    }
  };

  return (
    <TouchableOpacity onPress={handleOnPress} style={customBackButtonStyle.BackbuttonWrapper}>
      <View>
        <SvgIcon name="CaretLeft" />
      </View>
    </TouchableOpacity>
  );
};

const customBackButtonStyle = StyleSheet.create({
  BackbuttonWrapper: {
    paddingRight: 10,
    paddingTop: 7,
    paddingBottom: 7,
  },
});
