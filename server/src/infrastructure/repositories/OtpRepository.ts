import { IOtpRepository } from "../../domain/repositories/IOtpRepository";
import { OtpModel } from "../database/models/OtpModel";
import { Otp } from "../../domain/entities/Otp";
import { OtpMapper } from "../database/mappers/OtpMapper";

export class OtpRepository implements IOtpRepository {
  async save(
    otpData: Pick<Otp, "email" | "otp"> & Partial<Omit<Otp, "email" | "otp">>
  ): Promise<Otp> {
    await OtpModel.findOneAndDelete({ email: otpData.email });

    const otpToPersist = OtpMapper.toPersistence(otpData);
    const newOtpModel = new OtpModel(otpToPersist);
    const savedOtp = await newOtpModel.save();
    return OtpMapper.toDomain(savedOtp);
  }

  async findByEmail(email: string): Promise<Otp | null> {
    const otpModel = await OtpModel.findOne({ email });
    return otpModel ? OtpMapper.toDomain(otpModel) : null;
  }

  async delete(email: string): Promise<void> {
    await OtpModel.deleteOne({ email });
  }
}
