import type { Comment } from "../../domain/entities/Comment";
import type { UserBasicDto } from "./UserDto";

type CommentAuthorDto = Pick<
  UserBasicDto,
  "userId" | "fullname" | "firstname" | "lastname" | "username" | "imageUrl"
>;

export interface CommentResponseDto extends Omit<Comment, "_id"> {
  id: string;
  uploadedBy: CommentAuthorDto;
  repliesCount: number;
}
