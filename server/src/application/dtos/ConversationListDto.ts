export interface ConversationListDto {
  _id: string;
  conversationId: string;
  username: string;
  firstname: string;
  lastname: string;
  image?: string;
  unread: number;
  lastMessageTime?: Date;
  type: "conversation";
}
