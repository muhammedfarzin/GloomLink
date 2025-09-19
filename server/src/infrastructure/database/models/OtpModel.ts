import { type Document, model, Schema } from "mongoose";

export interface Otp {
  _id: Schema.Types.ObjectId;
  email: string;
  otp: string;
  createdAt: Date;
}

export type OtpDocument = Otp & Document;

const otpSchema = new Schema<Otp>({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "5m",
  },
});

export const OtpModel = model("Otp", otpSchema, "otps");
