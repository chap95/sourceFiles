export interface LetterReceivedDetailData {
  id: string;
  writerName: string;
  coverImageUrl: string;
  letterImageUrl: string[];
  destinationHint: string;
  fullAddress: string;
  content: string;
  isRead: boolean;
  isLocked: boolean;
}

export interface LetterSentDetailData {
  id: string;
  recipientAlias: string;
  recipients: string[];
  coverImageUrl: string;
  letterImageUrl: string[];
  destinationHint: string;
  fullAddress: string;
  content: string;
}
