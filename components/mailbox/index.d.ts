export interface MailBaseData {
  id: string;
  recipientAlias: string;
  recipients: string[];
  coverImageUrl: string;
  destinationHint: string;
  fullAddress: string;
  createdAt: string;
}

export interface MailReceivedData extends MailBaseData {
  writerName: string;
  isRead: boolean;
  isLocked: boolean;
}

export type MailSentData = MailBaseData;

export interface LetterReceived {
  id: string;
  writerName: string;
  coverImageUrl: string;
  destinationHint: string;
  fullAddress: string;
  isLocked: boolean;
  isRead: boolean;
  isBanned: boolean;
  letterImageUrl?: string[];
  recipientAlias?: string;
  content?: string;
  createdAt?: Date;
}

export interface LetterSent {
  id: string;
  recipientAlias: string;
  recipients: string[];
  coverImageUrl: string;
  destinationHint: string;
  fullAddress: string;
  content?: string;
  createdAt?: Date;
}
