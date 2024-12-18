import {LetterReceived, LetterSent} from '@/components/mailbox';
import {seekServiceAxiosInstance} from '@/utils/axiosinstances';
import {getParamsString} from '@/utils/utils';
import {useQuery} from '@tanstack/react-query';

export const READ_LETTER_DETAIL_KEY = '/letters/';
export const SENT_LETTER_DETAIL_KEY = '/letters/sent/';

function generateGetLetterDetailApiKey(params: {
  id: string;
  type?: 'sent' | 'received' | 'unlock';
}) {
  return [READ_LETTER_DETAIL_KEY, getParamsString(params)];
}

async function getReceivedLetterDetail(id: string) {
  const {data} = await seekServiceAxiosInstance.get<LetterReceived>(
    `${READ_LETTER_DETAIL_KEY + id}`,
  );

  return data;
}

async function getSentLetterDetail(id: string) {
  const {data} = await seekServiceAxiosInstance.get<LetterSent>(`${SENT_LETTER_DETAIL_KEY + id}`);

  return data;
}

function useLetterDetail({
  id,
  type,
  enabled = true,
}: {
  id: string;
  type?: 'sent' | 'received' | 'unlock';
  enabled?: boolean;
}): {
  data?: LetterReceived | LetterSent | null;
  isLoading: boolean;
  isError: boolean;
} {
  const {data, isLoading, isError} = useQuery<LetterReceived | LetterSent | null>(
    generateGetLetterDetailApiKey({id, type}),
    () => {
      if (type === 'received' || type === 'unlock') {
        return getReceivedLetterDetail(id);
      }

      if (type === 'sent') {
        return getSentLetterDetail(id);
      }

      return null;
    },
    {enabled: enabled},
  );

  return {
    data: data,
    isLoading,
    isError,
  };
}

export default useLetterDetail;
