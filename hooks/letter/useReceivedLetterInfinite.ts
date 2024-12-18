import {LetterReceived} from '@/components/mailbox';
import {seekServiceAxiosInstance} from '@/utils/axiosinstances';
import {getParamsString} from '@/utils/utils';
import {useInfiniteQuery, useQueryClient} from '@tanstack/react-query';
import {useEffect, useMemo} from 'react';
import {FetchLetterParams, LetterApiResponseData} from '.';

export const RECEIVED_LETTER_API_KEY = '/letters/received';

export async function fetchReceivedLetter(
  params: FetchLetterParams,
): Promise<LetterApiResponseData<LetterReceived>[]> {
  console.log('### [fetch] Received Letter');
  // TODO : axios.get generic에 배열이 들어가면 안 될 것 같은데...
  // 배열이 들어가지 않으면 useInfiniteQuery를 사용할 때 queryFn의 parameter 단에서 에러가 발생
  const {data} = await seekServiceAxiosInstance.get<LetterApiResponseData<LetterReceived>[]>(
    RECEIVED_LETTER_API_KEY + '?' + getParamsString(params),
  );

  return data;
}

export const generateGetReceivedLetterKey = (params: FetchLetterParams) => {
  return [RECEIVED_LETTER_API_KEY, params];
};

export function useReceivedLetterInfinite(params: FetchLetterParams) {
  const {data, isLoading, isError, fetchNextPage, refetch} = useInfiniteQuery(
    generateGetReceivedLetterKey(params),
    ({pageParam = 0}) => {
      if (params.canFetch) {
        return fetchReceivedLetter({...params, page: pageParam});
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
      queryClient.resetQueries({queryKey: [RECEIVED_LETTER_API_KEY]});
    };
  }, [queryClient]);

  return {
    data: refinedData,
    isLoading,
    isError,
    fetchNextPage,
    refetch,
  };
}
