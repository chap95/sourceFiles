export type RootParamList = {
  [key: string]: any;
};
export type CommonDrawerParamList = {
  CommonBottomTab: undefined;
  ProfileSettingStack: undefined;
};
export type CommonBottomTabParamList = {
  CommonBottomTab: undefined;
};
export type CommonStackParamList = {
  HomeStack: undefined;
  WriteLetterStack: undefined;
  MapStack: undefined;
};
export type SigninParamList = {
  PermissionGuide: undefined;
  SignIn: undefined;
};
export type HomeParamList = {
  Home: undefined;
  Alarm: undefined;
  MailboxTopTab: undefined;
  ReceivedMailbox: undefined;
  SentMailbox: undefined;
  ReadFrontLetter: any;
  ReadBackLetter: undefined;
};

export type WriteLetterParamList = {
  WriteLetter1: {
    letterContents: string;
    attachImages: {uri: string; name: string; type: string} | undefined;
  };
  WriteLetter1Map: undefined;
  WriteLetter2: undefined;
  Mailing: {letterId: string; writerName?: string; destinationHint?: string; shareToken: string};
  ShareWithFriends: {
    letterId: string;
  };
  WriteLetterComplete: undefined;
};

export type MapParamList = {
  Map: undefined;
};
