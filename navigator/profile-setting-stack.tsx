import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import colors from '@/styles/colors';
import ProfileSetting from '@/screens/profile-setting';
import {Text, TouchableOpacity} from 'react-native';
import SvgIcon from '@/components/svgIcon';

const Stack = createNativeStackNavigator();

function ProfileSettingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileSetting"
        component={ProfileSetting}
        options={({route, navigation}) => ({
          title: '프로필 수정',
          headerTitleAlign: 'center',
          headerBackTitleVisible: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <SvgIcon name="CaretLeft" />
            </TouchableOpacity>
          ),
          headerTintColor: colors.text_1,
          headerStyle: {backgroundColor: colors.bg_6},
          headerTitleStyle: {
            fontSize: 14,
          },
        })}
      />
    </Stack.Navigator>
  );
}

export default ProfileSettingStack;
