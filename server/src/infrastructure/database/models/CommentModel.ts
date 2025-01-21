import { model, Schema } from "mongoose";
import { PostModel } from "./PostModel";
import { HttpError } from "../../errors/HttpError";

export interface CommentType {
  targetId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  comment: string;
  type: "post";
}

const commentSchama = new Schema({
  targetId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "post",
    enum: ["post"],
  },
});

commentSchama.pre("save", function (next) {
  if (this.type === "post") {
    const existPost = PostModel.findById(this.targetId);
    if (!existPost) next(new HttpError(404, "Post not found"));
  }

  next();
});

export const CommentModel = model("Comment", commentSchama, "comments");
