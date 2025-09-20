import { type Document, model, Schema } from "mongoose";

export interface CommentType {
  _id: Schema.Types.ObjectId;
  targetId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  comment: string;
  type: "post" | "comment";
}

export type CommentDocument = CommentType & Document;

const commentSchama = new Schema<CommentType>(
  {
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
  },
  { timestamps: true }
);

export const CommentModel = model("Comment", commentSchama, "comments");
