import { type Document, model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { sendMail } from "../../../application/services/mail.service";

export interface Otp {
  _id: Schema.Types.ObjectId;
  email: string;
  otp: string;
  createdAt: Date;
}

export interface OtpDocument extends Document {}

const otpSchema = new Schema<Otp>({
  email: {
    type: String,
    required: true
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

async function sendVerificationEmail(email: string, otp: string) {
  const mailResponse = await sendMail(
      email,
      'GloomLink Verification Email',
      `<h1>Please confirm your OTP</h1>
       <p>Here is your OTP code: ${otp}</p>`
  );
  return mailResponse;
}

otpSchema.pre("save", async function (next) {
  await sendVerificationEmail(this.email, this.otp);
  this.otp = await bcrypt.hash(this.otp, 10);
  next();
});

export const OtpModel = model('Otp', otpSchema, 'otps');
