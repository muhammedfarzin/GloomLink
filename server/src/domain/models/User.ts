import type { PostCompact } from "./Post";

export interface UserCompactProfile {
  userId: string;
  username: string;
  fullname: string;
  firstname: string;
  lastname?: string;
  imageUrl?: string;
  isFollowing?: boolean;
}

export interface UserProfile extends UserCompactProfile {
  posts: Omit<PostCompact, "tags">[];
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
}

export interface UserListView extends UserCompactProfile {
  isFollowing?: boolean;
  type: "user";
}
