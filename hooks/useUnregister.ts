import {seekServiceAxiosInstance} from '@/utils/axiosinstances';
import {useMutation} from '@tanstack/react-query';

const UNREGISTER_KEY = '/users';

export async function deleteUser() {
  const response = await seekServiceAxiosInstance.delete(UNREGISTER_KEY);

  return response;
}

export function useUnregister(
  accessToken: string | null,
  onSuccess?: () => void,
  onError?: () => void,
) {
  const key = [UNREGISTER_KEY, {accessToken: accessToken}];

  const {isSuccess, isLoading, isError, mutateAsync} = useMutation({
    mutationKey: key,
    mutationFn: async () => {
      if (accessToken) {
        return await deleteUser();
      }
    },
    onSuccess: () => {
      console.log('### [unregister] success');
      onSuccess && onSuccess();
    },
    onError: () => {
      console.log('### [unregister] error');
      onError && onError();
    },
  });

  return {
    unRegister: mutateAsync,
    isSuccess,
    isError,
    isLoading,
  };
}
