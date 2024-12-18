import produce from 'immer';
import {atom, DefaultValue, selector} from 'recoil';

export interface WriteLetterData {
  recipientAlias?: string;
  latitude?: number;
  longitude?: number;
  fullAddress?: string;
  destinationHint?: string;
  coverImage?: {
    uri: string;
    name: string;
    type: string;
  };
  coverImagePreview?: {
    uri: string;
  };
  content?: string;
  attachImages?: {
    uri: string;
    name: string;
    type: string;
  };
  attachImagesPreview?: {
    uri: string;
  };
}

type TKeyofWriteLetterData = keyof WriteLetterData;

export const writeLetterDataState = atom<WriteLetterData | null>({
  key: 'writeLetterDataState',
  default: null,
});

export const writeLetterDataSelector = selector<WriteLetterData | null>({
  key: 'writeLetterDataSelector',
  get: ({get}) => {
    return get(writeLetterDataState);
  },
  set: ({set, get, reset}, newValue) => {
    if (!newValue || newValue instanceof DefaultValue) {
      reset(writeLetterDataState);
    } else {
      const currentState = get(writeLetterDataState);

      if (newValue && !(newValue instanceof DefaultValue)) {
        if (!currentState) {
          set(writeLetterDataState, newValue);
          return;
        }

        const nextState = produce(currentState, draftState => {
          if (draftState) {
            (Object.keys(newValue) as TKeyofWriteLetterData[]).forEach(key => {
              if (currentState[key] !== newValue[key]) {
                (draftState as any)[key] = newValue[key];
              }
            });
          }
        });

        set(writeLetterDataState, nextState);
      }
    }
  },
});

export const profileImagesState = atom<{uri: string; name: string; type: string} | null>({
  key: 'profileImages',
  default: null,
});
export const profileImagesPreviewState = atom<{uri: string} | null>({
  key: 'profileImagesPreview',
  default: null,
});
