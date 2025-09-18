import { Types } from "mongoose";
import { Otp } from "../../../domain/entities/Otp";
import { OtpDocument } from "../models/OtpModel";

export class OtpMapper {
  public static toDomain(otpModel: OtpDocument): Otp {
    const otpObject = otpModel.toObject<OtpDocument>();

    return {
      ...otpObject,
      _id: otpObject._id.toString(),
    };
  }

  public static toPersistence(otp: Partial<Otp>): any {
    const persistenceOtp: any = { ...otp };

    if (otp._id) {
      persistenceOtp._id = new Types.ObjectId(otp._id);
    }

    return persistenceOtp;
  }
}
