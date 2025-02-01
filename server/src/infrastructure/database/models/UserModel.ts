import { type Document, model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface User {
  _id: Schema.Types.ObjectId;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  authType?: "email" | "google";
  status: "active" | "inactive" | "blocked" | "not-verified";
  image?: string;
  gender?: string;
  dob?: Date;
  blockedUsers: Schema.Types.ObjectId[];
  savedPosts: Schema.Types.ObjectId[];
  subscriptionAmount?: number;
}

export type UserDocument = User & Document;

const userSchema = new Schema<User>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String },
    image: { type: String, default: null },
    authType: {
      type: String,
      default: "email",
      enum: ["email", "google"],
    },
    status: {
      type: String,
      default: "not-verified",
      enum: ["active", "inactive", "blocked", "not-verified"],
    },
    gender: { type: String, default: null, enum: ["m", "f"] },
    dob: { type: Date, default: null },
    blockedUsers: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    savedPosts: { type: [Schema.Types.ObjectId], ref: "Post", default: [] },
    subscriptionAmount: Number,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

export const UserModel = model<User>("User", userSchema, "users");
