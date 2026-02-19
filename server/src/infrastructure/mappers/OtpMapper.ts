import { Otp } from "../../domain/entities/Otp";
import { OtpType } from "../../domain/models/Otp";

export class OtpMapper {
  public static toDomain(otp: OtpType): Otp {
    return new Otp(otp);
  }

  public static toPersistence(otp: Otp): OtpType {
    return {
      otpId: otp.getId(),
      email: otp.getEmail(),
      hashedOtp: otp.getHashedOtp(),
      createdAt: otp.getCreatedAt(),
    };
  }
}
