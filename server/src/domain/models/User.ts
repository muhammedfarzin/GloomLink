export type UserStatusType = "active" | "blocked" | "not-verified" | "deleted";
type UserAuthType = "email" | "google";

export interface UserCompact {
  id: string;
  username: string;
  fullname: string;
  firstname: string;
  lastname?: string;
  imageUrl?: string;
  status: UserStatusType;
  isFollowing?: boolean;
  type: "user";
}

export interface UserSelf extends UserCompact {
  passwordHash: string;
  email: string;
  mobile?: string;
  gender?: "f" | "m";
  dob?: Date;
  authType: UserAuthType;
  blockedUsers?: string[];
  savedPosts?: string[];
  interestKeywords?: string[];
}

export interface UserProfile extends Omit<UserCompact, "passwordHash"> {
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
}
