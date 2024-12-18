import LetterItem from '@/components/common/letterItem';
import Loading from '@/components/common/Loading';
import Empty from '@/components/mailbox/Empty';
import useSentLetterInfinite from '@/hooks/letter/useSentLetterInfinite';
import colors from '@/styles/colors';
import React, {useCallback, useMemo} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

function SentMailbox({navigation}: any) {
  const handleOnPress = useCallback(
    ({id, alias}: {id: string; alias: string}) => {
      navigation.navigate('ReadFrontLetter', {id: id, alias: alias, type: 'sent'});
    },
    [navigation],
  );

  const {data, isLoading, fetchNextPage} = useSentLetterInfinite({
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
      return flattedData.map(value => value.content).flatMap(value => value);
    }

    return null;
  }, [flattedData]);

  if (isLoading) {
    return <Loading text="보낸 편지들을 가져오고 있어요." />;
  }

  return (
    <View style={sentMailBoxStyle.SentMailboxWrapper}>
      <View style={sentMailBoxStyle.SentMailboxInnerWrapper}>
        <FlatList
          data={contentExtractedFromData}
          ListEmptyComponent={() => {
            return <Empty />;
          }}
          renderItem={({item, index}) => (
            <LetterItem
              key={`${item.id}_${index}`}
              type="sent"
              content={item}
              handleOnpress={() => {
                handleOnPress({id: item.id, alias: item.recipientAlias});
              }}
              width="90%"
            />
          )}
          onEndReached={() => {
            fetchNextPage();
          }}
          contentContainerStyle={
            contentExtractedFromData && contentExtractedFromData.length > 0
              ? sentMailBoxStyle.MailListContentContainer
              : sentMailBoxStyle.MailListEmptyContainer
          }
          style={sentMailBoxStyle.MailListWrapper}
        />
      </View>
    </View>
  );
}

export default SentMailbox;

const sentMailBoxStyle = StyleSheet.create({
  SentMailboxWrapper: {
    height: '100%',
    backgroundColor: colors.bg_6,
  },
  SentMailboxInnerWrapper: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  MailListWrapper: {
    height: '100%',
    marginTop: 26,
  },
  MailListContentContainer: {
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
