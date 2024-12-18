import {EmptyBell} from '@/assets';
import colors from '@/styles/colors';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const EmptyAlarm = () => {
  return (
    <View style={styles.NoneAlarmWrapper}>
      <View style={styles.BellWrapper}>
        {/* <AlarmCountingBadge /> */}
        <EmptyBell />
      </View>
      <Text style={styles.NoneAlarmLabel}>새로운 알림이 없어요.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  NoneAlarmWrapper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg_6,
  },
  BellWrapper: {
    position: 'relative',
  },
  NoneAlarmLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text_4,
    marginTop: 12,
  },
  CountingBadgeWrapper: {
    position: 'absolute',
    top: 20,
    right: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 16,
    borderRadius: 100,
    backgroundColor: '#d9d9d9',
    zIndex: 3,
  },
  CountingBadgeLabel: {
    position: 'absolute',
    fontSize: 14,
    fontWeight: '500',
    color: colors.text_5,
  },
});

export default EmptyAlarm;
