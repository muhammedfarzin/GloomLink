import { model, Schema } from "mongoose";
import { HttpError } from "../../errors/HttpError";

export interface FollowType {
  _id: Schema.Types.ObjectId;
  followedBy: Schema.Types.ObjectId;
  followingTo: Schema.Types.ObjectId;
}

const followSchema = new Schema<FollowType>(
  {
    followedBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    followingTo: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

followSchema.pre("save", function (next) {
  if (this.followedBy.toString() === this.followingTo.toString()) {
    return next(
      new HttpError(400, "Following and Followed user cannot be same")
    );
  }

  next();
});

export const FollowModel = model("Follow", followSchema, "follows");
