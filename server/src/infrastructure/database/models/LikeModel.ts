import { Document, model, Schema } from "mongoose";

export interface Like {
  _id: Schema.Types.ObjectId;
  targetId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  type: "post";
}

export type LikeDocument = Like & Document;

const likeSchema = new Schema<Like>(
  {
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      enum: ["post"],
      default: "post",
    },
  },
  { timestamps: true }
);

export const LikeModel = model("Like", likeSchema, "likes");
