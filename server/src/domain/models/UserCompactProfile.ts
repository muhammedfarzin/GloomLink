export interface UserCompactProfile {
  userId: string;
  username: string;
  fullname: string;
  firstname: string;
  lastname?: string;
  imageUrl?: string;
  email?: string;
  mobile?: string;
  dob?: Date;
  gender?: "f" | "m";
  isFollowing?: boolean;
}
