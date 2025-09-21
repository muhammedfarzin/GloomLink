import { Comment } from "../../domain/entities/Comment";

interface CommentAuthorDto {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  image?: string;
}

export interface CommentResponseDto extends Comment {
  uploadedBy: CommentAuthorDto;
  repliesCount: number;
}
