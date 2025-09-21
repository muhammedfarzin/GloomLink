import { Post } from "./Post";

type PostDataType = Pick<
  Post,
  | "_id"
  | "caption"
  | "images"
  | "isSaved"
  | "isLiked"
  | "uploadedBy"
  | "status"
  | "likesCount"
  | "commentsCount"
  | "reportCount"
>;

export default PostDataType;
