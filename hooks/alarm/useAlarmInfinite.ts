import {AlarmBaseData} from '@/components/alarm';
import {seekServiceAxiosInstance} from '@/utils/axiosinstances';
import {getParamsString} from '@/utils/utils';
import {useInfiniteQuery, useQueryClient} from '@tanstack/react-query';
import {useEffect, useMemo} from 'react';
import {AlarmApiResponseData, FetchAlarmParams} from '.';

export const ALARMS_API_KEY = '/alarms';

export async function fetchAlarm(
  params: FetchAlarmParams,
): Promise<AlarmApiResponseData<AlarmBaseData>[]> {
  console.log('### [fetch] Alarm');
  // TODO : axios.get generic에 배열이 들어가면 안 될 것 같은데...
  // 배열이 들어가지 않으면 useInfiniteQuery를 사용할 때 queryFn의 parameter 단에서 에러가 발생
  const {data} = await seekServiceAxiosInstance.get<AlarmApiResponseData<AlarmBaseData>[]>(
    ALARMS_API_KEY + '?' + getParamsString(params),
  );

  return data;
}

export const generateGetAlarmKey = (params: FetchAlarmParams) => {
  return [ALARMS_API_KEY, params];
};

export function useAlarmInfinite(params: FetchAlarmParams) {
  const {data, isLoading, isError, fetchNextPage} = useInfiniteQuery(
    generateGetAlarmKey(params),
    ({pageParam = 0}) => {
      if (params.canFetch) {
        return fetchAlarm({...params, page: pageParam});
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
      queryClient.resetQueries({queryKey: [ALARMS_API_KEY]});
    };
  }, [queryClient]);

  return {
    data: refinedData,
    isLoading,
    isError,
    fetchNextPage,
  };
}
