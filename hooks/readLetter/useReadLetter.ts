import {seekServiceAxiosInstance} from '@/utils/axiosinstances';
import {useMutation} from '@tanstack/react-query';

function generatePatchReadLetterApiPath(id: string) {
  return `/letters/${id}/read`;
}

async function patchReadLetter(id?: string) {
  if (!id) {
    return null;
  }

  const {data} = await seekServiceAxiosInstance.patch(generatePatchReadLetterApiPath(id));

  return data;
}

function useReadLetter({
  id,
  handleOnSuccess,
  handleOnError,
}: {
  id?: string;
  handleOnSuccess: () => void;
  handleOnError: () => void;
}) {
  const {data, isError, isLoading, mutate} = useMutation({
    mutationKey: ['patchReadLetter', id],
    mutationFn: () => {
      return patchReadLetter(id);
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
    changeReadStatus: mutate,
  };
}

export default useReadLetter;
