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

export interface UserProfile extends CompactUser {
  followersCount: number;
  followingCount: number;
  subscriptionAmount?: number;
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
