import { model, Schema } from "mongoose";
import { HttpError } from "../../errors/HttpError";

export interface Post {
  _id: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  caption?: string;
  images: string[];
  tags: string[];
  publishedFor: "public" | "subscriber";
  status: "active" | "blocked";
}

const postSchema = new Schema<Post>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  caption: {
    type: String,
  },
  images: {
    type: [String],
    default: [],
  },
  tags: {
    type: [String],
    default: [],
  },
  publishedFor: {
    type: String,
    default: "public",
    enum: ["public", "subscriber"],
  },
  status: {
    type: String,
    default: "active",
    enum: ["active", "blocked"],
  },
});

postSchema.pre("save", function (next) {
  if (!this.caption && (!this.images || this.images.length === 0)) {
    return next(
      new HttpError(400, "Either caption or images must be provided.")
    );
  }
  next();
});

export const PostModel = model<Post>("Post", postSchema, "posts");
