import colors from '@/styles/colors';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {HeartLockSingle, LetterSmall} from '@/assets';

export interface IAlarmItem {
  id: string;
  title: string;
  content: string;
  type: string;
  isRead: boolean;
}

const AlarmItem = (props: IAlarmItem) => {
  const {id, title, content, type, isRead} = props;

  const alarmJudgment = (isType: string, isReadInFn: boolean) => {
    if (isType === 'RECEIVE' && isReadInFn) {
      return (
        <View style={alarmItemStyles.IconWrapper}>
          <LetterSmall style={alarmItemStyles.Icon} />
        </View>
      );
    } else if (isType === 'RECEIVE' && !isReadInFn) {
      return (
        <View style={alarmItemStyles.IconWrapper}>
          <LetterSmall style={alarmItemStyles.Icon} />
          <View style={alarmItemStyles.circle} />
        </View>
      );
    } else if (isType === 'BROWSE' && isReadInFn) {
      return (
        <View style={alarmItemStyles.IconWrapper}>
          <HeartLockSingle style={alarmItemStyles.Icon} />
        </View>
      );
    } else if (isType === 'BROWSE' && !isReadInFn) {
      return (
        <View style={alarmItemStyles.IconWrapper}>
          <HeartLockSingle style={alarmItemStyles.Icon} />
          <View style={alarmItemStyles.circle} />
        </View>
      );
    }
  };

  return (
    <TouchableOpacity>
      <View style={alarmItemStyles.ListItemOuterWrapper}>
        <View style={alarmItemStyles.ListItemInnerWrapper}>
          {alarmJudgment(type, isRead)}
          <View style={alarmItemStyles.TextWrapper}>
            <Text style={alarmItemStyles.Title}>{title}</Text>

            <Text numberOfLines={2} style={alarmItemStyles.Description}>
              {content}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const alarmItemStyles = StyleSheet.create({
  ListItemOuterWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#434344',
  },
  ListItemInnerWrapper: {
    height: 108,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  IconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0,
    width: 57,
    height: 57,
    borderRadius: 28.5,
    marginRight: 16,
    backgroundColor: colors.bg_4,
  },
  TextWrapper: {
    flex: 1,
  },
  Title: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  Description: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5D6077',
    marginTop: 12,
  },
  Icon: {
    width: 48,
    height: 48,
  },
  circle: {
    position: 'absolute',
    backgroundColor: '#E14F3B',
    width: 5,
    height: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E14F3B',
    top: 0,
    right: 0,
  },
});

export default AlarmItem;
