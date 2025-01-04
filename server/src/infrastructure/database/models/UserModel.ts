import { type Document, model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export type User = {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  status: "active" | "inactive" | "blocked" | "not-verified";
  image?: string;
  gender?: string;
  dob?: Date;
  conversations: Schema.Types.ObjectId[];
  blockedUsers: Schema.Types.ObjectId[];
  savedPosts: Schema.Types.ObjectId[];
};

export type UserDocument = User & Document;

const userSchema = new Schema<User>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  image: { type: String, default: null },
  status: {
    type: String,
    default: "not-verified",
    enum: ["active", "inactive", "blocked", "not-verified"],
  },
  gender: { type: String, default: null, enum: ["m", "f"] },
  dob: { type: Date, default: null },
  conversations: {
    type: [Schema.Types.ObjectId],
    ref: "Conversation",
    default: [],
  },
  blockedUsers: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
  savedPosts: { type: [Schema.Types.ObjectId], ref: "Post", default: [] },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

export const UserModel = model<User>("User", userSchema, "users");
