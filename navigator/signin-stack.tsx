import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignIn from '@/screens/signin';
import PermissionGuide from '@/screens/permission-guide';

const Stack = createNativeStackNavigator();

function SigninStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PermissionGuide"
        component={PermissionGuide}
        options={{title: '권한허용', headerShown: false}}
      />
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{title: '로그인', headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default SigninStack;
