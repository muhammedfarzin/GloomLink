import { injectable } from "inversify";
import type { IOtpRepository } from "@/domain/repositories/IOtpRepository";
import type { Otp } from "@/domain/entities/Otp";
import { OtpModel } from "../database/models/OtpModel";
import { OtpMapper } from "../mappers/OtpMapper";

@injectable()
export class OtpRepository implements IOtpRepository {
  async create(otp: Otp): Promise<Otp> {
    const { email, hashedOtp } = OtpMapper.toPersistence(otp);
    await OtpModel.findOneAndDelete({ email });

    const newOtpModel = new OtpModel({ email, hashedOtp });
    const savedOtp = await newOtpModel.save();
    return OtpMapper.toDomain(savedOtp);
  }

  async findById(id: string): Promise<Otp | null> {
    const otpDoc = await OtpModel.findById(id);
    return otpDoc && OtpMapper.toDomain(otpDoc);
  }

  async findByEmail(email: string): Promise<Otp | null> {
    const otpModel = await OtpModel.findOne({ email });
    return otpModel && OtpMapper.toDomain(otpModel);
  }

  async update(data: Otp): Promise<Otp | null> {
    const { id, email, hashedOtp } = OtpMapper.toPersistence(data);
    const updatedOtp = await OtpModel.findByIdAndUpdate(
      id,
      { email, hashedOtp },
      { new: true },
    );
    return updatedOtp && OtpMapper.toDomain(updatedOtp);
  }

  async deleteById(id: string): Promise<Otp | null> {
    const deletedOtp = await OtpModel.findByIdAndDelete(id);
    return deletedOtp && OtpMapper.toDomain(deletedOtp);
  }

  async deleteByEmail(email: string): Promise<boolean> {
    const deletedOtp = await OtpModel.deleteOne({ email });
    return deletedOtp.acknowledged;
  }
}
