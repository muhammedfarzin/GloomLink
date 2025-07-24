import Comment from "./Comment";

export type HandleReplyCommentType = (newReply: Comment) => void;

export interface ReplyCommentType {
  commentId: string;
  username: string;
  handleReplyComment: HandleReplyCommentType;
}
