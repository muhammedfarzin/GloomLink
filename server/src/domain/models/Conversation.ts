export interface ConversationType {
  id: string;
  participants: string[];
}

export interface ConversationList {
  id: string;
  participantId: string;
  username: string;
  firstname: string;
  lastname: string;
  imageUrl?: string;
  unread: number;
  lastMessageTime?: Date;
  type: "conversation";
}
