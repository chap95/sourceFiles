import Error from '@/components/common/Error';
import LetterBack from '@/components/readLetter/LetterBack';
import useReadLetter from '@/hooks/readLetter/useReadLetter';
import {stackNavigateParamsState} from '@/states/stackNavigateParamsState';
import {useQueryClient} from '@tanstack/react-query';
import React, {useEffect, useMemo} from 'react';
import {useResetRecoilState, useSetRecoilState} from 'recoil';
import {RECEIVED_LETTER_API_KEY} from '../hooks/letter/useReceivedLetterInfinite';

function ReadBacksLetter({navigation, route}: {navigation: any; route: any}) {
  const letterType = useMemo(() => {
    if (route?.params?.type) {
      return route.params.type as string;
    }

    return null;
  }, [route]);

  const queryClient = useQueryClient();
  const setStackNavigateParams = useSetRecoilState(stackNavigateParamsState);
  const resetStackNavigateParams = useResetRecoilState(stackNavigateParamsState);

  const {changeReadStatus} = useReadLetter({
    id: route.params.data.id,
    handleOnSuccess: () => {
      queryClient.invalidateQueries({queryKey: [RECEIVED_LETTER_API_KEY]});
    },
    handleOnError: () => {
      console.log('### [error] on patch read status');
    },
  });

  useEffect(() => {
    if (letterType === 'received') {
      if (route?.params?.data) {
        const data = route.params.data;

        if (data.id && !data.isLocked && !data.isRead) {
          console.log('### [CHANGE READ STATUS] => ', data.id);
          changeReadStatus();
        }
      }
    }
  }, [route, changeReadStatus, letterType]);

  useEffect(() => {
    if (route?.params?.data?.id) {
      setStackNavigateParams({id: route.params.data.id, type: letterType});
    }

    return () => {
      resetStackNavigateParams();
    };
  }, [route, setStackNavigateParams, resetStackNavigateParams, letterType]);

  useEffect(() => {
    if (route?.params?.data) {
      const {writerName, recipientAlias} = route.params.data as any;
      const name = writerName ? writerName : recipientAlias ? recipientAlias : null;

      navigation.setOptions({headerTitle: name ?? ''});
    }
  }, [navigation, route]);

  if (!route || !route.params || !route.params.data) {
    return <Error />;
  }

  return <LetterBack {...route.params.data} navigation={navigation} />;
}

export default ReadBacksLetter;
