export interface ConversationListDto {
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
