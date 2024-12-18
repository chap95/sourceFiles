import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import WriteLetterStack from '@/navigator/write-letter-stack';
import SvgIcon from '@/components/svgIcon';
import HomeStack from '@/navigator/home-stack';
import MapStack from '@/navigator/map-stack';

const BottomTab = createBottomTabNavigator();

function CommonBottomTab() {
  const setVisibility = (route: any): object => {
    if (!route.name) {
      return {display: 'flex'};
    }
    if (route.name === 'WriteLetterStack') {
      return {display: 'none'};
    } else if (route.name === 'ReadFrontLetter') {
      return {display: 'none'};
    } else if (route.name === 'ReadBackLetter') {
      return {display: 'none'};
    } else {
      return {display: 'flex'};
    }
  };

  return (
    <BottomTab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1B1C2C',
          borderTopWidth: 0,
          height: 80,
          // TODO 활성화
          // position: absolute
          // borderTopLeftRadius: 15,
          // borderTopRightRadius: 15,
          paddingBottom: 20,
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({focused, color, size}) => {
          let iconName: 'Home' | 'HomeOutline' | 'Plus' | 'Map' | 'MapOutline' = 'Home';

          if (route.name === 'HomeStack') {
            iconName = focused ? 'HomeOutline' : 'Home';
          } else if (route.name === 'WriteLetterStack') {
            iconName = focused ? 'Plus' : 'Plus';
          } else if (route.name === 'MapStack') {
            iconName = focused ? 'MapOutline' : 'Map';
          }
          return <SvgIcon name={iconName} />;
        },
      })}>
      <BottomTab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{title: '홈', unmountOnBlur: false}}
      />
      <BottomTab.Screen
        name="WriteLetterStack"
        component={WriteLetterStack}
        options={({route}) => ({
          title: '',
          tabBarStyle: setVisibility(route),
          unmountOnBlur: true,
        })}
      />
      <BottomTab.Screen
        name="MapStack"
        component={MapStack}
        options={{title: '지도', unmountOnBlur: false}}
      />
    </BottomTab.Navigator>
  );
}

export default CommonBottomTab;
