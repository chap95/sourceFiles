import {seekServiceAxiosInstance} from '@/utils/axiosinstances';
import {useMutation} from '@tanstack/react-query';

interface LetterRecipientsParams {
  shareToken: string;
}

export const LETTER_RECIPIENTS_KEY = '/letter-recipients';

export async function postLetterRecipients(params: LetterRecipientsParams) {
  const data = await seekServiceAxiosInstance.post(LETTER_RECIPIENTS_KEY, params);

  return data;
}

export function useLetterRecipients({
  shareToken,
  onSuccessHandler,
  onErrorHandler,
}: {
  shareToken?: any;
  onSuccessHandler?: () => void;
  onErrorHandler?: () => void;
}) {
  const {isError, isSuccess, isLoading, status, mutateAsync, mutate} = useMutation({
    mutationKey: [
      LETTER_RECIPIENTS_KEY,
      {
        shareToken: shareToken,
      },
    ],
    mutationFn: async () => {
      if (shareToken) {
        return await postLetterRecipients({shareToken: shareToken});
      }

      return null;
    },
    onSuccess: () => {
      if (onSuccessHandler) {
        onSuccessHandler();
      }
    },
    onError: () => {
      if (onErrorHandler) {
        onErrorHandler();
      }
    },
  });

  return {
    postLetterRecipientsAsync: mutateAsync,
    postLetterRecipients: mutate,
    status,
    isSuccess,
    isError,
    isLoading,
  };
}
