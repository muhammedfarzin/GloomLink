import type { Comment } from "../../domain/entities/Comment";
import { UserCompactProfile } from "../../domain/models/UserCompactProfile";

type CommentAuthorDto = Pick<
  UserCompactProfile,
  "userId" | "fullname" | "firstname" | "lastname" | "username" | "imageUrl"
>;

export interface CommentResponseDto extends Omit<Comment, "_id"> {
  id: string;
  uploadedBy: CommentAuthorDto;
  repliesCount: number;
}
