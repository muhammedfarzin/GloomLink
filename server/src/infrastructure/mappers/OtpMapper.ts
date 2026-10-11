import { Mapper } from "./Mapper";
import { injectable } from "inversify";
import { Otp } from "@/domain/entities/Otp";
import type { OtpType } from "@/domain/models/Otp";
import type { OtpDocument } from "../database/models/OtpModel";

@injectable()
export class OtpMapper extends Mapper<Otp, OtpType | OtpDocument> {
  public toDomain(otp: OtpType | OtpDocument): Otp {
    return new Otp({
      id: otp.id,
      email: otp.email,
      hashedOtp: otp.hashedOtp,
      createdAt: otp.createdAt,
    });
  }

  public toPersistence(otp: Otp): OtpType {
    return {
      id: otp.getId(),
      email: otp.getEmail(),
      hashedOtp: otp.getHashedOtp(),
      createdAt: otp.getCreatedAt(),
    };
  }
}
