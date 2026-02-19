import { injectable } from "inversify";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository";
import { OtpDocument, OtpModel } from "../database/models/OtpModel";
import { Otp } from "../../domain/entities/Otp";
import { OtpMapper } from "../mappers/OtpMapper";
import { OtpType } from "../../domain/models/Otp";

@injectable()
export class OtpRepository implements IOtpRepository {
  async create(otp: Otp): Promise<Otp> {
    const { createdAt, otpId, ...otpToPersist } = OtpMapper.toPersistence(otp);
    await OtpModel.findOneAndDelete({ email: otpToPersist.email });

    const newOtpModel = new OtpModel(otpToPersist);
    const savedOtp = await newOtpModel.save();
    return OtpMapper.toDomain(this.safeParseOtpDoc(savedOtp));
  }

  async findByEmail(email: string): Promise<Otp | null> {
    const otpModel = await OtpModel.findOne({ email });
    return otpModel ? OtpMapper.toDomain(this.safeParseOtpDoc(otpModel)) : null;
  }

  async delete(email: string): Promise<boolean> {
    const deletedOtp = await OtpModel.deleteOne({ email });
    return deletedOtp.acknowledged;
  }

  private safeParseOtpDoc(otpDoc: OtpDocument): OtpType {
    const { _id: otpId, ...otpObj } = otpDoc.toObject();
    return {
      ...otpObj,
      otpId: otpId.toString(),
    };
  }
}
