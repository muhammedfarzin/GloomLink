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
  interestKeywords: string[];
}

export type UserDocument = User & Document;

const INTEREST_KEYWORDS_LIMIT = 100;

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
    interestKeywords: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  if (
    this.interestKeywords &&
    this.interestKeywords.length > INTEREST_KEYWORDS_LIMIT
  ) {
    const uniqueKeywords = [...new Set(this.interestKeywords)];
    console.log("new before keywords:", this.interestKeywords);
    this.interestKeywords = uniqueKeywords.slice(0, INTEREST_KEYWORDS_LIMIT);
    console.log("new after keywords:", this.interestKeywords);
  }

  next();
});

export const UserModel = model<User>("User", userSchema, "users");
