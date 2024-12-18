import {accessTokenState} from '@/states';
import {seekServiceAxiosInstance} from '@/utils/axiosinstances';
import {BASE_URL} from '@/utils/variables';
import {useMutation} from '@tanstack/react-query';
import {useRecoilValue} from 'recoil';

export const ALARM_API_KEY = '/alarms/read';

async function putAlarm(id?: string[], accessToken?: string) {
  if (!id || id.length === 0) {
    return null;
  }

  const response = await seekServiceAxiosInstance.put(
    `${BASE_URL}alarms/read`,
    {
      alarmIds: id,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response;
}

function useUpdateAlarm({
  id,
  handleOnSuccess,
  handleOnError,
}: {
  id?: string[];
  handleOnSuccess: () => void;
  handleOnError: () => void;
}) {
  const accessToken = useRecoilValue(accessTokenState);

  const {data, isError, isLoading, mutateAsync} = useMutation({
    mutationKey: id,
    mutationFn: () => {
      return putAlarm(id, accessToken ?? undefined);
    },
    onSuccess: () => {
      handleOnSuccess();
    },
    onError: () => {
      handleOnError();
    },
  });

  return {
    data,
    isLoading,
    isError,
    changeReadStatus: mutateAsync,
  };
}

export default useUpdateAlarm;
