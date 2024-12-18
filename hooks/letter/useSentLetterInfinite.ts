import {LetterSent} from '@/components/mailbox';
import {seekServiceAxiosInstance} from '@/utils/axiosinstances';
import {getParamsString} from '@/utils/utils';
import {useInfiniteQuery, useQueryClient} from '@tanstack/react-query';
import {useEffect, useMemo} from 'react';
import {FetchLetterParams, LetterApiResponseData} from '.';

const SENT_LETTER_API_KEY = '/letters/sent';

export async function fetchSentLetter(params: FetchLetterParams) {
  const {data} = await seekServiceAxiosInstance.get<LetterApiResponseData<LetterSent>[]>(
    `${SENT_LETTER_API_KEY}?${getParamsString(params)}`,
  );

  return data;
}

function generateGetSentLetterKey(params: FetchLetterParams) {
  console.log('### [fetch] sent letter');
  return [SENT_LETTER_API_KEY, getParamsString(params)];
}

function useSentLetterInfinite(params: FetchLetterParams) {
  const {data, isLoading, isError, fetchNextPage} = useInfiniteQuery(
    generateGetSentLetterKey(params),
    ({pageParam = 0}) => {
      if (params.canFetch) {
        return fetchSentLetter({...params, page: pageParam});
      }

      return [];
    },
    {
      getNextPageParam: (lastPage, allPage) => {
        const totalPage = (allPage[0] as any).totalPages;

        if (totalPage === allPage.length) {
          return undefined;
        }
        return allPage.length - 1 + 1;
      },
    },
  );

  const refinedData = useMemo(() => {
    if (data && data.pages && data.pages.length > 0) {
      return data.pages;
    }

    return null;
  }, [data]);

  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      queryClient.resetQueries({queryKey: [SENT_LETTER_API_KEY]});
    };
  }, [queryClient]);

  return {
    data: refinedData,
    isLoading,
    isError,
    fetchNextPage,
  };
}

export default useSentLetterInfinite;
