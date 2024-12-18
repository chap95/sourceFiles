import colors from '@/styles/colors';
import React, {useMemo} from 'react';
import {Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RNLocalize from 'react-native-localize';
import {LetterReceived, LetterSent} from '../mailbox';

const LetterItem = ({
  content,
  type,
  handleOnpress,
  width,
}: {
  content: LetterReceived | LetterSent;
  type: 'received' | 'sent';
  width?: string;
  handleOnpress?: (value?: any) => void;
}) => {
  const {
    recipients,
    isBanned,
    recipientAlias,
    coverImageUrl,
    destinationHint,
    fullAddress,
    createdAt,
  } = content as any;

  const refinedDate = useMemo(() => {
    if (!createdAt) {
      return null;
    }

    // 타임 존 UTC를 적용시킵니다.
    const utcZonedCreatedAt = createdAt + 'Z';

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
  }, [createdAt]);

  return (
    <TouchableOpacity onPress={isBanned ? undefined : handleOnpress}>
      <View style={{...styles.LetterWrapper, width: width}}>
        <View style={styles.HeaderWrapper}>
          <Text style={styles.ReceipientAlias}>{isBanned ? '신고한 편지' : recipientAlias}</Text>
          {recipients && recipients.length > 0 && (
            <Text style={styles.ReceipientName}>
              {`${recipients[0]}${recipients.length > 1 ? ` 외 ${recipients.length - 1}명` : ''}`}
            </Text>
          )}
        </View>

        <View style={styles.BodyWrapper}>
          <View style={styles.ThumbnailWrapper}>
            {isBanned ? (
              <ImageBackground
                source={{uri: coverImageUrl}}
                style={styles.Thumbnail}
                blurRadius={80}
              />
            ) : (
              <Image source={{uri: coverImageUrl}} style={styles.Thumbnail} />
            )}
          </View>

          <View style={styles.LetterInfosWrapper}>
            <Text style={styles.DestinationHint}>
              {isBanned ? '신고한 편지는 정보를 표시하지 않습니다.' : destinationHint}
            </Text>
            <Text style={styles.FullAddress}>{isBanned ? '' : fullAddress}</Text>
            {refinedDate && <Text style={styles.CreatedAt}>{isBanned ? '' : refinedDate}</Text>}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  LetterWrapper: {
    paddingTop: 16,
    paddingBottom: 16,
    alignSelf: 'center',
  },
  HeaderWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
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
    color: 'white',
    alignSelf: 'flex-start',
    marginRight: 8,
  },
  ReceipientName: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  DestinationHint: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  FullAddress: {
    fontSize: 10,
    color: colors.text_4,
  },
  CreatedAt: {
    fontSize: 12,
    color: colors.text_2,
  },
  ThumbnailWrapper: {
    width: 68,
    height: 68,
    overflow: 'hidden',
    borderRadius: 8,
    flex: 0,
  },
  Thumbnail: {
    width: '100%',
    height: '100%',
  },
});

export default LetterItem;
