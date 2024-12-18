import AlarmItem from '@/components/alarm/AlarmItem';
import EmptyAlarm from '@/components/alarm/EmptyAlarm';
import {selectedAlarmIdState} from '@/components/alarm/store/selectedFilterId';
import Loading from '@/components/common/Loading';
import {useAlarmInfinite} from '@/hooks/alarm/useAlarmInfinite';
import useSendAlarm, {ALARM_API_KEY} from '@/hooks/alarm/useSendAlarm';
import colors from '@/styles/colors';
import {useFocusEffect} from '@react-navigation/native';
import {useQueryClient} from '@tanstack/react-query';
import React, {useCallback, useEffect, useMemo} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useRecoilValue} from 'recoil';

function Alarm() {
  const selectedFilterId = useRecoilValue(selectedAlarmIdState);

  const {data, isLoading, fetchNextPage} = useAlarmInfinite({
    page: 0,
    size: 10,
    canFetch: true,
  });

  const flattedData = useMemo(() => {
    if (data) {
      return data.flatMap(value => value);
    }
  }, [data]);

  const contentExtractedFromData = useMemo(() => {
    if (flattedData) {
      const refinedListFromData = flattedData.map(value => value.content).flatMap(value => value);
      if (selectedFilterId === 'all') {
        return refinedListFromData;
      }
    }

    return null;
  }, [flattedData, selectedFilterId]);

  const extractedIdFromData = useMemo(() => {
    if (contentExtractedFromData) {
      const idArray: string[] = contentExtractedFromData.map(({id}: {id: string}) => id);
      return idArray;
    }
  }, [contentExtractedFromData]);

  const queryClient = useQueryClient();
  const {changeReadStatus} = useSendAlarm({
    id: extractedIdFromData,
    handleOnSuccess: () => {
      queryClient.invalidateQueries({queryKey: [ALARM_API_KEY]});
    },
    handleOnError: () => {
      console.log('### [error] on put read status');
    },
  });

  useFocusEffect(
    useCallback(() => {
      if (extractedIdFromData) {
        changeReadStatus();
      }
    }, [changeReadStatus, extractedIdFromData]),
  );

  if (isLoading) {
    return <Loading text="알림들을 가져오고 있어요." />;
  }

  return (
    <View style={AlramStyles.AlarmPageWrapper}>
      {contentExtractedFromData && contentExtractedFromData.length > 0 ? (
        <FlatList
          data={contentExtractedFromData}
          renderItem={({item, index}) => <AlarmItem key={`${item.id}_${index}`} {...item} />}
          onEndReached={() => {
            fetchNextPage();
          }}
        />
      ) : (
        <EmptyAlarm />
      )}
    </View>
  );
}

export default Alarm;

const AlramStyles = StyleSheet.create({
  AlarmPageWrapper: {
    position: 'relative',
    height: '100%',
    backgroundColor: colors.bg_6,
  },
});
