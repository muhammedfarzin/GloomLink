export interface CompactUser {
  userId: string;
  username: string;
  firstname: string;
  lastname: string;
  fullname: string;
  imageUrl?: string;
  isFollowing?: boolean;
  type: "user";
}

export type Conversation = {
  conversationId: string;
  participantId: string;
  username: string;
  firstname: string;
  lastname: string;
  imageUrl: string;
  unread: number;
  type: "conversation";
};
