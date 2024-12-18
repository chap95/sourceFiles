import Error from '@/components/common/Error';
import Loading from '@/components/common/Loading';
import {LetterReceived, LetterSent} from '@/components/mailbox';
import LetterFront from '@/components/readLetter/LetterFront';
import LetterReport from '@/components/readLetter/LetterReport';
import {
  isShowLetterReportIconState,
  isShowLetterReportState,
} from '@/components/readLetter/LetterReportState';
import {LETTER_RECIPIENTS_KEY, useLetterRecipients} from '@/hooks/letter/useLetterRecipients';
import {useLetterReport} from '@/hooks/letter/useLetterReport';
import {RECEIVED_LETTER_API_KEY} from '@/hooks/letter/useReceivedLetterInfinite';
import useLetterDetail from '@/hooks/readLetter/useLetterDetail';
import {useQueryClient} from '@tanstack/react-query';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useRecoilState, useSetRecoilState} from 'recoil';

function ReadFrontLetter({navigation, route}: {navigation: any; route: any}) {
  const {params} = route;
  const {id, type, shareToken} = params ?? {};

  const [isReadyToFetchLetterDetailInfo, setIsReadyToFetchLetterDetailInfo] =
    useState<boolean>(false);

  const handlePostLetterRecipientsSuccess = () => {
    setIsReadyToFetchLetterDetailInfo(true);
  };

  const handlePostLetterRecipientsError = () => {
    setIsReadyToFetchLetterDetailInfo(true);
  };

  const setIsShowLetterReportIcon = useSetRecoilState(isShowLetterReportIconState);
  const [isShowLetterReport, setIsShowLetterReport] = useRecoilState(isShowLetterReportState);

  const queryClient = useQueryClient();

  const {
    postLetterRecipients,
    status: letterRecipientsStatus,
    isLoading: isLetterRecipientsLoading,
    isError: isLetterRecipientsError,
  } = useLetterRecipients({
    shareToken,
    onSuccessHandler: handlePostLetterRecipientsSuccess,
    onErrorHandler: handlePostLetterRecipientsError,
  });

  const refinedIsLetterRecipientsError = isLetterRecipientsError && !!shareToken;

  const {
    data,
    isLoading: isLetterDetailLoading,
    isError: isLetterDetailError,
  } = useLetterDetail({
    id: id ?? '',
    type: type,
    // route params 에 shareToken 이 있는지 없는지 검사되기 전 까지는 편지 정보를 불러오지 않음
    enabled: isReadyToFetchLetterDetailInfo || !shareToken,
  });

  const handleOnSuccessLetterReport = () => {
    console.log('### After Report Success');
    setIsShowLetterReport(false);
    queryClient.invalidateQueries({queryKey: [RECEIVED_LETTER_API_KEY]});
    navigation.navigate('MailboxTopTab');
  };

  const {patchLetterReport} = useLetterReport({
    letterId: id,
    onSuccess: handleOnSuccessLetterReport,
  });

  const isLoading = isLetterRecipientsLoading || isLetterDetailLoading;
  const isError = refinedIsLetterRecipientsError || isLetterDetailError;

  const errorText: string | undefined = (() => {
    if (isLetterDetailError) {
      return '편지 정보를 불러올 수 없습니다.';
    }

    if (isLetterRecipientsError) {
      return '받은 편지함을 통해 접근해주세요.';
    }
  })();

  useEffect(() => {
    if (type && type === 'received') {
      setIsShowLetterReportIcon(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  // 딥링크 클릭시 편지 앞면으로 떨어진 후에 메모리에 편지 앞면이 계속 남아있어서
  // 편지 목록에서 편지 앞면 접근시 Error가 발생
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', (event: any) => {
      setIsReadyToFetchLetterDetailInfo(false);
      queryClient.resetQueries({
        queryKey: [LETTER_RECIPIENTS_KEY],
      });
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  useEffect(() => {
    if (shareToken) {
      // deep link를 통해서 편지 앞면으로 떨어진 경우
      postLetterRecipients();
    }
  }, [shareToken, postLetterRecipients]);

  useEffect(() => {
    return () => {
      setIsReadyToFetchLetterDetailInfo(false);
      setIsShowLetterReportIcon(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data) {
      const {writerName, recipientAlias} = data as any;
      const name = writerName ? writerName : recipientAlias ? recipientAlias : null;

      navigation.setOptions({headerTitle: name ?? ''});
    }
  }, [navigation, data]);

  if (isLoading) {
    return <Loading text="편지 정보를 가져오고 있어요." />;
  }

  if (!data || isError) {
    return <Error text={errorText} />;
  }

  // 받은 편지 앞면 랜더링
  if ((data as any).isRead !== undefined) {
    const letterReceivedData = data as LetterReceived;
    const {destinationHint, coverImageUrl, fullAddress, isRead, isLocked} = letterReceivedData;

    const handleOnPressReadBackSide = () => {
      if (!isLocked) {
        navigation.navigate('ReadBackLetter', {
          data: data,
          type: 'received',
        });
      }
    };

    return (
      <View
        style={{
          position: 'relative',
        }}>
        <LetterFront
          destinationHint={destinationHint}
          fullAddress={fullAddress}
          coverImageUrl={coverImageUrl}
          isRead={isRead}
          isLocked={isLocked}
          isUnlock={route?.params?.type === 'unlock'}
          onPressReadLetterButton={handleOnPressReadBackSide}
        />
        {isShowLetterReport && (
          <LetterReport
            onClickCancel={() => {
              setIsShowLetterReport(false);
            }}
            onClickReport={patchLetterReport}
          />
        )}
      </View>
    );
  }

  // 보낸 편지 앞면 랜더링
  const letterSentData = data as LetterSent;
  const {destinationHint, coverImageUrl, fullAddress} = letterSentData;

  const handleOnPressReadBackSide = () => {
    navigation.navigate('ReadBackLetter', {data: data, type: 'sent'});
  };

  return (
    <LetterFront
      destinationHint={destinationHint}
      fullAddress={fullAddress}
      coverImageUrl={coverImageUrl}
      onPressReadLetterButton={handleOnPressReadBackSide}
    />
  );
}

export default ReadFrontLetter;
