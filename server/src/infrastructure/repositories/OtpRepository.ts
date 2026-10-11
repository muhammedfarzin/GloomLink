import type { Model } from "mongoose";
import { inject, injectable } from "inversify";
import { TYPES } from "@/shared/types";
import type { IOtpRepository } from "@/domain/repositories/IOtpRepository";
import type { Otp } from "@/domain/entities/Otp";
import type { OtpDocument } from "../database/models/OtpModel";
import { OtpMapper } from "../mappers/OtpMapper";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class OtpRepository
  extends BaseRepository<Otp, OtpDocument>
  implements IOtpRepository
{
  constructor(
    @inject(TYPES.OtpModel) protected readonly model: Model<OtpDocument>,
    @inject(TYPES.OtpMapper) protected readonly mapper: OtpMapper,
  ) {
    super();
  }

  async create(otp: Otp): Promise<Otp> {
    const { email, hashedOtp } = this.mapper.toPersistence(otp);
    await this.model.findOneAndDelete({ email });

    const newOtpModel = new this.model({ email, hashedOtp });
    const savedOtp = await newOtpModel.save();
    return this.mapper.toDomain(savedOtp);
  }

  async findByEmail(email: string): Promise<Otp | null> {
    const otpModel = await this.model.findOne({ email });
    return otpModel && this.mapper.toDomain(otpModel);
  }

  async deleteByEmail(email: string): Promise<boolean> {
    const deletedOtp = await this.model.deleteOne({ email });
    return deletedOtp.acknowledged;
  }
}
