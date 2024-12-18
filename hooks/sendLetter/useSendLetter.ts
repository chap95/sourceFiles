import {accessTokenState} from '@/states';
import {seekServiceAxiosInstance} from '@/utils/axiosinstances';
import {BASE_URL} from '@/utils/variables';
import {useMutation} from '@tanstack/react-query';
import {useRecoilValue} from 'recoil';

export type lettersResponse = {
  data: {id: string; writerName: string; destinationHint: string; shareToken: string};
};

async function postSendLetter(
  data?: FormData,
  accessToken?: string,
): Promise<lettersResponse | null> {
  if (!data) {
    return null;
  }

  const response = await seekServiceAxiosInstance.post(`${BASE_URL}letters`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
}

export function useSendLetter({
  key,
  handleSendLetterSuccess,
  handleSendLetterFail,
}: {
  key: string[];
  handleSendLetterSuccess?: (response: lettersResponse) => void;
  handleSendLetterFail?: () => void;
}) {
  const accessToken = useRecoilValue(accessTokenState);

  const {data, isLoading, isError, mutate, mutateAsync} = useMutation({
    mutationKey: key,
    mutationFn: (formData?: FormData) => {
      return postSendLetter(formData, accessToken ?? undefined);
    },
    onMutate: () => {
      console.log('### [pending] send letter');
    },
    onSuccess: response => {
      if (handleSendLetterSuccess && response) {
        console.log('### [success] send letter');
        handleSendLetterSuccess(response);
      }
    },
    onError: (error: Error) => {
      console.log('### [error] send error -> ', error.name, error.message);
    },
  });

  return {
    data,
    isLoading,
    isError,
    sendLetterSync: mutate,
    sendLeterAsync: mutateAsync,
  };
}
