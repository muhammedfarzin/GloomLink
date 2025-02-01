import { Types } from "mongoose";
import { BankAccountType } from "../../infrastructure/database/models/BankAccountModel";

export interface ISubscriptionRepository {
  addSubscription(
    userId: string,
    datas: { amount: number; name: string; accountNumber: string; ifsc: string }
  ): Promise<void>;

  checkEligibility(userId: string): Promise<boolean>;
}
