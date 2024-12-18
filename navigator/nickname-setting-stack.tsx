import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NicknameSetting from '@/screens/nickname-setting';
import colors from '@/styles/colors';

const Stack = createNativeStackNavigator();

function NicknameSettingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="NicknameSetting"
        component={NicknameSetting}
        options={({route, navigation}) => ({
          title: '닉네임 설정',
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
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

export default NicknameSettingStack;
