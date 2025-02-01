import { Types } from "mongoose";
import { ISubscriptionRepository } from "../../domain/repositories/ISubscriptionRepository";
import { BankAccountModel } from "../database/models/BankAccountModel";
import { UserModel } from "../database/models/UserModel";
import { HttpError } from "../errors/HttpError";
import { FollowModel } from "../database/models/FollowModel";

class SubscriptionRepository implements ISubscriptionRepository {
  async addSubscription(
    userId: string,
    datas: { amount: number; name: string; accountNumber: string; ifsc: string }
  ) {
    try {
      const { amount, name, accountNumber, ifsc } = datas;

      const user = await UserModel.findById(userId);
      if (!user) throw new HttpError(404, "Invalid userId");

      const existBankAccount = await BankAccountModel.exists({
        userId: Types.ObjectId.createFromHexString(userId),
      });

      if (!existBankAccount) {
        const bankAccount = new BankAccountModel({
          userId,
          name,
          accountNumber,
          ifsc,
        });
        await bankAccount.save();
      }

      const followersCount = await FollowModel.countDocuments({
        followingTo: user._id,
      });

      if (followersCount < 5)
        throw new HttpError(403, "You are not eligible for this feature");
      if (user.subscriptionAmount)
        throw new HttpError(400, "Subscription already enabled");

      await user.updateOne({
        $set: { subscriptionAmount: amount },
      });
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errorMessage = error.message.split(": ").pop();
        throw new HttpError(400, errorMessage);
      }
      throw error;
    }
  }

  async checkEligibility(userId: string) {
    const followersCount = await FollowModel.countDocuments({ followingTo: userId });
    return followersCount > 5;
  }
}

export const subscriptionRepository = new SubscriptionRepository();
