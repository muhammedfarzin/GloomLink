import { Document, model, Schema } from "mongoose";
import { HttpError } from "../../errors/HttpError";
import { PostModel } from "./PostModel";

export interface Like {
  _id: Schema.Types.ObjectId;
  targetId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  type: "post";
}

export type LikeDocument = Like & Document;

const likeSchema = new Schema<Like>({
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
});

likeSchema.pre("save", function (next) {
  if (this.type === "post") {
    const existPost = PostModel.findById(this.targetId);
    if (!!existPost) return next();

    next(new HttpError(404, "Post not found"));
  }

  next(new HttpError(400, "Invalid request"));
});

export const LikeModel = model("Like", likeSchema, "likes");
