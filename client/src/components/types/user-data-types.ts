export interface UserDataType {
  userId: string;
  username: string;
  firstname: string;
  lastname: string;
  fullname: string;
  imageUrl?: string;
  isFollowing?: boolean;
  type: "user";
}

export type ChatUserDataType = {
  conversationId: string;
  participantId: string;
  username: string;
  firstname: string;
  lastname: string;
  imageUrl: string;
  unread: number;
  type: "conversation";
};
