import { type Document, model, Schema } from "mongoose";

export interface Otp {
  _id: Schema.Types.ObjectId;
  email: string;
  hashedOtp: string;
  createdAt: Date;
}

export type OtpDocument = Otp & Document;

const otpSchema = new Schema<Otp>({
  email: {
    type: String,
    required: true,
  },
  hashedOtp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "5m",
  },
});

otpSchema.index({ email: 1 });

export const OtpModel = model("Otp", otpSchema, "otps");
