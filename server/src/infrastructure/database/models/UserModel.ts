import { type Document, model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface UserDocument extends Document {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  image?: string;
  conversations: Schema.Types.ObjectId[];
  blockedUsers: Schema.Types.ObjectId[];
  savedPosts: Schema.Types.ObjectId[];
}

const userSchema = new Schema<UserDocument>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  image: { type: String, default: null },
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

export const UserModel = model<UserDocument>("User", userSchema, "users");
