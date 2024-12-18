import {seekServiceAxiosInstance} from '@/utils/axiosinstances';
import {useMutation} from '@tanstack/react-query';

const patchLetterReportQueryKey = 'lettersReport';

async function patchLetterReport(letterId: number) {
  const {data} = await seekServiceAxiosInstance.patch(`letters/${letterId}/report`);

  return data;
}

export function useLetterReport({letterId, onSuccess}: {letterId: number; onSuccess?: () => void}) {
  const {data, isLoading, isError, isSuccess, mutateAsync} = useMutation(
    [patchLetterReportQueryKey, letterId],
    () => {
      return patchLetterReport(letterId);
    },
    {
      onSuccess: onSuccess,
    },
  );

  return {
    patchLetterReport: mutateAsync,
    isLoading,
    isError,
    isSuccess,
  };
}
