export interface UserCompactProfile {
  userId: string;
  username: string;
  fullName: string;
  firstname: string;
  lastname?: string;
  imageUrl?: string;
  isFollowing?: boolean;
}
