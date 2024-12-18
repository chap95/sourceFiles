import colors from '@/styles/colors';
import React, {useMemo} from 'react';
import RNLocalize from 'react-native-localize';
import {ImageBackground, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import fonts from '@/styles/fonts';

interface mapItemType {
  id: string;
  coverImageUrl: string;
  destinationHint: string;
  latitude: number;
  longitude: number;
  fullAddress: string;
  createdAt: string;
  isWriter: boolean;
  isLocked: boolean;
  isRead: boolean;
}

const MapItem = ({
  content,
  handleOnpress,
  width,
}: {
  content: mapItemType;
  handleOnpress?: (value?: any) => void;
  width?: string;
}) => {
  const {isLocked, coverImageUrl, destinationHint, fullAddress, createdAt} = content;

  // 타임 존 UTC를 적용시킵니다.
  const utcZonedCreatedAt = createdAt + 'Z';

  const refinedDate = useMemo(() => {
    const castingDate = new Date(utcZonedCreatedAt).toLocaleDateString(undefined, {
      timeZone: RNLocalize.getTimeZone(),
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });

    try {
      const [dateInfo, timeInfo, noonInfo] = castingDate.split(' ');
      const [month, day, year] = dateInfo.split('/');
      const [hour, minute] = timeInfo.split(':');

      let refinedHour: string | number = hour;

      if (noonInfo.toUpperCase() === 'PM') {
        refinedHour = parseInt(hour) + 12;
      }

      const refinedYear = year.replace(',', '');

      return `${refinedYear}.${month}.${day} ${refinedHour}:${minute}`;
    } catch {
      return castingDate;
    }
  }, [utcZonedCreatedAt]);

  return (
    <TouchableOpacity onPress={handleOnpress}>
      <View style={{...styles.MailItemWrapper, width: width}}>
        <View style={styles.BodyWrapper}>
          <View style={styles.ThumbnailWrapper}>
            <Image source={{uri: coverImageUrl}} style={styles.Thumbnail} />
            {isLocked ? (
              <View style={styles.roundView}>
                {/* <Image source={require('@/assets/lock-map.png')} style={[styles.lock]} /> */}
                <Image source={require('@/assets/lock-map.png')} />
              </View>
            ) : (
              ''
            )}
          </View>
          <View style={styles.LetterInfosWrapper}>
            <Text style={styles.DestinationHint}>{destinationHint}</Text>
            <Text style={styles.FullAddress}>{fullAddress}</Text>
            <Text style={styles.CreatedAt}>{refinedDate}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  MailItemWrapper: {
    paddingBottom: 16,
    paddingTop: 16,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  BodyWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  LetterInfosWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginLeft: 16,
    flex: 1,
  },
  ReceipientAlias: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text_6,
    alignSelf: 'flex-start',
    marginRight: 8,
  },
  ReceipientName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text_3,
  },
  DestinationHint: {
    fontSize: fonts.body4.fontSize,
    fontWeight: '500',
    color: colors.text_3,
  },
  FullAddress: {
    fontSize: fonts.body6.fontSize,
    color: colors.text_4,
  },
  CreatedAt: {
    fontSize: fonts.body4.fontSize,
    color: colors.text_2,
  },
  ThumbnailWrapper: {
    width: 56,
    height: 56,
    overflow: 'hidden',
    borderRadius: 8,
    flex: 0,
  },
  Thumbnail: {
    width: '100%',
    height: '100%',
  },
  lock: {
    backgroundColor: 'write',
  },
  roundView: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: colors.bg_0,
  },
});

export default MapItem;
