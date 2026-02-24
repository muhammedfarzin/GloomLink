import type { UserCompactProfile } from "./UserCompactProfile";

export interface CommentType {
  id: string;
  targetId: string;
  userId: string;
  comment: string;
  type: "post" | "comment";
  createdAt: Date;
  updatedAt: Date;
}

type CommentAuthorDto = Pick<
  UserCompactProfile,
  "userId" | "fullname" | "firstname" | "lastname" | "username" | "imageUrl"
>;

export interface CommentResponse extends CommentType {
  uploadedBy: CommentAuthorDto;
  repliesCount: number;
}
