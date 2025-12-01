import { Comment } from "../../domain/entities/Comment";

interface CommentAuthorDto {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  image?: string;
}

export interface CommentResponseDto extends Omit<Comment, "_id"> {
  id: string;
  uploadedBy: CommentAuthorDto;
  repliesCount: number;
}
