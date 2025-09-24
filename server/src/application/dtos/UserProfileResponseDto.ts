import { Post } from "../../domain/entities/Post";

export interface UserProfileResponseDto {
  _id: string;
  username: string;
  firstname: string;
  lastname: string;
  fullname: string;
  image?: string;
  posts: Omit<Post, "tags">[];
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
}
