import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CommonBottomTab from '@/navigator/common-bottom-tab';
import ProfileSettingStack from '@/navigator/profile-setting-stack';
import MyPage from '@/screens/my-page';

const Drawer = createDrawerNavigator();

function CommonDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
        drawerStyle: {
          backgroundColor: 'rgba(22, 21, 36, 0.8)',
          width: '100%',
        },
        drawerType: 'front',
      }}
      drawerContent={props => <MyPage {...props} />}>
      <Drawer.Screen name="CommonBottomTab" component={CommonBottomTab} />
      <Drawer.Screen name="ProfileSettingStack" component={ProfileSettingStack} />
    </Drawer.Navigator>
  );
}

export default CommonDrawer;
