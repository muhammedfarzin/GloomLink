export interface UserCompactProfile {
  userId: string;
  username: string;
  fullname: string;
  firstname: string;
  lastname?: string;
  imageUrl?: string;
  isFollowing?: boolean;
}
