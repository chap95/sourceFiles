import {atom} from 'recoil';

export const writerNameState = atom<string>({key: 'writerName', default: ''});
export const receiverAliasState = atom<string>({key: 'receiverAlias', default: ''});
