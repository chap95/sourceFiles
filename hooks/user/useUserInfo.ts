import {seekServiceAxiosInstance} from '@/utils/axiosinstances';
import {useQuery} from '@tanstack/react-query';

export interface UserInfoResponse {
  id: string;
  name: string;
  profileImageUrl: string;
  pushNotificationAgreement: boolean;
  useForMarketingAgreement: boolean;
}

interface UserInfoParams {
  onSuccessHandler?: (data?: UserInfoResponse) => void;
  onErrorHandler?: (error?: any) => void;
}

const userInfoQueryKey = 'users/me';

async function getUserInfoApi() {
  const {data} = await seekServiceAxiosInstance.get<UserInfoResponse>(userInfoQueryKey);

  return data;
}

export function useUserInfo(params?: UserInfoParams) {
  const {onSuccessHandler, onErrorHandler} = params ?? {};

  const {data, isLoading, isSuccess, isError} = useQuery(
    [userInfoQueryKey],
    () => {
      return getUserInfoApi();
    },
    {
      onSuccess: onSuccessHandler,
      onError: onErrorHandler,
    },
  );

  return {
    data,
    isLoading,
    isSuccess,
    isError,
  };
}
