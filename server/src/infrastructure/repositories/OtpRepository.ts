import { injectable } from "inversify";
import type { IOtpRepository } from "@/domain/repositories/IOtpRepository";
import type { Otp } from "@/domain/entities/Otp";
import type { OtpDocument } from "../database/models/OtpModel";
import { OtpModel } from "../database/models/OtpModel";
import { OtpMapper } from "../mappers/OtpMapper";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class OtpRepository
  extends BaseRepository<Otp, OtpDocument>
  implements IOtpRepository
{
  protected readonly model = OtpModel;
  protected readonly mapper = OtpMapper;

  async create(otp: Otp): Promise<Otp> {
    const { email, hashedOtp } = OtpMapper.toPersistence(otp);
    await OtpModel.findOneAndDelete({ email });

    const newOtpModel = new OtpModel({ email, hashedOtp });
    const savedOtp = await newOtpModel.save();
    return OtpMapper.toDomain(savedOtp);
  }

  async findByEmail(email: string): Promise<Otp | null> {
    const otpModel = await OtpModel.findOne({ email });
    return otpModel && OtpMapper.toDomain(otpModel);
  }

  async deleteByEmail(email: string): Promise<boolean> {
    const deletedOtp = await OtpModel.deleteOne({ email });
    return deletedOtp.acknowledged;
  }
}
