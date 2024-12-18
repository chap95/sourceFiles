/* eslint-disable react/prop-types */
import LetterItem from '@/components/common/letterItem';
import Loading from '@/components/common/Loading';
import Empty from '@/components/mailbox/Empty';
import FilterGroup from '@/components/mailbox/received/filterGroup';
import {selectedIdState} from '@/components/mailbox/received/store/selectedFilterId';
import {useLetterRecipients} from '@/hooks/letter/useLetterRecipients';
import {
  RECEIVED_LETTER_API_KEY,
  useReceivedLetterInfinite,
} from '@/hooks/letter/useReceivedLetterInfinite';
import colors from '@/styles/colors';
import {RootParamList} from '@/types/navigation-types';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useQueryClient} from '@tanstack/react-query';
import React, {useCallback, useLayoutEffect, useMemo} from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import {useRecoilValue} from 'recoil';

function ReceivedMailbox({navigation}: any) {
  const route = useRoute<RouteProp<RootParamList, 'MailboxTopTab'>>();
  const {params} = route;
  const {shareToken} = params?.screens.ReceivedMailbox ?? {};

  const queryClient = useQueryClient();
  const {
    postLetterRecipients,
    isLoading: postLetterRecipientsIsLoading,
    isSuccess: postLetterRecipientIsSuccess,
  } = useLetterRecipients({
    shareToken: shareToken,
    onSuccessHandler: () => {
      queryClient.invalidateQueries({
        queryKey: [RECEIVED_LETTER_API_KEY],
      });
    },
  });

  const selectedFilterId = useRecoilValue(selectedIdState);
  const {data, isLoading, fetchNextPage} = useReceivedLetterInfinite({
    page: 0,
    size: 10,
    canFetch: true,
    enabled: !shareToken || (!!shareToken && postLetterRecipientIsSuccess),
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: [RECEIVED_LETTER_API_KEY],
    });
  };

  const handleOnPress = useCallback(
    ({id, writerName}: {id: string; writerName: string}) => {
      navigation.push('ReadFrontLetter', {id: id, writerName: writerName, type: 'received'});
    },
    [navigation],
  );

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
      } else if (selectedFilterId === 'read') {
        return refinedListFromData.filter(value => value.isRead);
      } else {
        return refinedListFromData.filter(value => !value.isRead);
      }
    }

    return null;
  }, [flattedData, selectedFilterId]);

  useLayoutEffect(() => {
    if (shareToken) {
      postLetterRecipients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareToken]);

  if (isLoading || postLetterRecipientsIsLoading) {
    return <Loading text="받은 편지들을 가져오고 있어요." />;
  }

  return (
    <View style={receivedMailBoxStyles.ReceivedMailboxWrapper}>
      <View style={receivedMailBoxStyles.ReceivedMailboxInnerWrapper}>
        <FilterGroup />

        <FlatList
          data={contentExtractedFromData}
          refreshControl={<RefreshControl onRefresh={handleRefresh} refreshing={isLoading} />}
          ListEmptyComponent={() => {
            return <Empty />;
          }}
          renderItem={({item, index}) => (
            <LetterItem
              key={`${item.id}_${index}`}
              type="received"
              content={item}
              handleOnpress={() => {
                handleOnPress({id: item.id, writerName: item.writerName});
              }}
              width="90%"
            />
          )}
          onEndReached={() => {
            fetchNextPage();
          }}
          contentContainerStyle={
            contentExtractedFromData && contentExtractedFromData.length > 0
              ? receivedMailBoxStyles.MailListContentContainer
              : receivedMailBoxStyles.MailListEmptyContainer
          }
          style={receivedMailBoxStyles.MailListWrapper}
        />
      </View>
    </View>
  );
}

export default ReceivedMailbox;

const receivedMailBoxStyles = StyleSheet.create({
  ReceivedMailboxWrapper: {
    height: '100%',
    backgroundColor: colors.bg_6,
  },
  ReceivedMailboxInnerWrapper: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  MailListWrapper: {
    position: 'relative',
    height: '100%',
    marginTop: 26,
  },
  MailListContentContainer: {
    position: 'relative',
    paddingBottom: 100,
  },
  MailListEmptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingBottom: 100,
  },
});
