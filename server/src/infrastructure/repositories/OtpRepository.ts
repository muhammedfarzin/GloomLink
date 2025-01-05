import { OtpModel } from "../database/models/OtpModel";
import { User } from "../database/models/UserModel";
import otpGenerator from "otp-generator";
import { HttpError } from "../errors/HttpError";
import bcrypt from "bcryptjs";

class OtpRepository {
  async generateOtp({ email }: Pick<User, "email">): Promise<void> {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    await OtpModel.findOneAndDelete({ email });
    const newOtp = new OtpModel({ otp, email });

    await newOtp.save();
  }

  async verifyOtp(
    { email }: Pick<User, "email">,
    otp: string
  ): Promise<boolean> {
    const existOtp = await OtpModel.findOne({ email });

    if (!existOtp) {
      throw new HttpError(
        404,
        "Otp not found, please check your email address"
      );
    }

    const isOtpMatched = await bcrypt.compare(otp, existOtp.otp);
    if (!isOtpMatched) return false;

    await existOtp.deleteOne();

    return true;
  }
}

export const otpRepository = new OtpRepository();
