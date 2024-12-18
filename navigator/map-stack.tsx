import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Map from '@/screens/map';
import Alarm from '@/screens/alarm';
import {Pressable, View} from 'react-native';
import SvgIcon from '@/components/svgIcon';
import colors from '@/styles/colors';
import useLocationPermission from '@/hooks/use-location-permission';

const Stack = createNativeStackNavigator();

function MapStack() {
  // useLocationPermission();
  return (
    <Stack.Navigator
      screenOptions={({route, navigation}) => ({
        headerTintColor: colors.text_1,
        headerStyle: {backgroundColor: colors.bg_6},
        headerTitleStyle: {
          fontWeight: 'bold',
        },
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
      <Stack.Screen name="Map" component={Map} options={{title: '지도'}} />
      <Stack.Screen
        name="Alarm"
        component={Alarm}
        options={({route, navigation}) => ({
          title: '알림',
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
          headerTintColor: colors.text_1,
          headerStyle: {backgroundColor: colors.bg_6},
          headerRight: () => <View />,
        })}
      />
    </Stack.Navigator>
  );
}

export default MapStack;
