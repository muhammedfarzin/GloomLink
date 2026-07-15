export interface CompactUser {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  fullname: string;
  imageUrl?: string;
  status: "active" | "blocked" | "not-verified";
  isFollowing?: boolean;
  type: "user";
}

export interface UserProfile extends CompactUser {
  followersCount: number;
  followingCount: number;
  subscriptionAmount?: number;
}

export type Conversation = {
  id: string;
  participantId: string;
  username: string;
  firstname: string;
  lastname: string;
  imageUrl: string;
  unread: number;
  type: "conversation";
};
