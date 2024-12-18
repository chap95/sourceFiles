import {seekServiceAxiosInstance} from '@/utils/axiosinstances';
import {useQuery} from '@tanstack/react-query';

interface LettersCountsResponse {
  sendLetterCount: number;
  receiveLetterCount: number;
}

const lettersCountQueryKey = 'letters/counts';

async function getLettersCountApi() {
  const {data} = await seekServiceAxiosInstance.get<LettersCountsResponse>(lettersCountQueryKey);

  return data;
}

export function useLettersCounts() {
  const {data, isLoading, isError, isSuccess} = useQuery([lettersCountQueryKey], () => {
    return getLettersCountApi();
  });

  return {
    data,
    isLoading,
    isError,
    isSuccess,
  };
}
