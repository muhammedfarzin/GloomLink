import { Post } from "./Post";

type PostDataType = Pick<
  Post,
  | "_id"
  | "caption"
  | "images"
  | "saved"
  | "liked"
  | "uploadedBy"
  | "status"
  | "likesCount"
  | "commentsCount"
  | "reportCount"
>;

export default PostDataType;
