import { type Document, model, Schema } from "mongoose";
import { PostModel } from "./PostModel";
import { HttpError } from "../../errors/HttpError";

export interface CommentType {
  _id: Schema.Types.ObjectId;
  targetId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  comment: string;
  type: "post" | "comment";
}

export type CommentDocument = CommentType & Document;

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
    enum: ["post", "comment"],
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
