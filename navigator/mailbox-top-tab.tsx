import ReceivedMailbox from '@/screens/received-mailbox';
import SentMailbox from '@/screens/sent-mailbox';
import colors from '@/styles/colors';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';

const TopTab = createMaterialTopTabNavigator();

function MailboxTopTab() {
  return (
    <TopTab.Navigator
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        position: 'relative',
        backgroundColor: colors.bg_6,
      }}
      tabBarOptions={{
        indicatorStyle: {
          position: 'absolute',
          bottom: -3,
          height: 4,
          backgroundColor: colors.primary_default,
          borderRadius: 12,
        },
        style: {
          backgroundColor: colors.bg_6,
        },
      }}>
      <TopTab.Screen
        name="ReceivedMailbox"
        component={ReceivedMailbox}
        options={{
          title: '받은 편지함',
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: colors.text_3,
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: '500',
          },
        }}
      />
      <TopTab.Screen
        name="SentMailbox"
        component={SentMailbox}
        options={{
          title: '보낸 편지함',
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: colors.text_3,
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: '500',
          },
        }}
      />
    </TopTab.Navigator>
  );
}

export default MailboxTopTab;
