export interface ConversationType {
  conversationId: string;
  participants: string[];
}

export interface ConversationList {
  participantId: string;
  conversationId: string;
  username: string;
  firstname: string;
  lastname: string;
  imageUrl?: string;
  unread: number;
  lastMessageTime?: Date;
  type: "conversation";
}
