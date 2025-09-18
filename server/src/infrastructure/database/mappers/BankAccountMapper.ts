import { Types } from "mongoose";
import { BankAccount } from "../../../domain/entities/BankAccount";
import { BankAccountDocument } from "../models/BankAccountModel";

export class BankAccountMapper {
  public static toDomain(bankAccountModel: BankAccountDocument): BankAccount {
    const bankAccountObject = bankAccountModel.toObject<BankAccountDocument>();

    return {
      ...bankAccountObject,
      _id: bankAccountObject._id.toString(),
      userId: bankAccountObject.userId.toString(),
    };
  }

  public static toPersistence(bankAccount: Partial<BankAccount>): any {
    const persistenceBankAccount: any = { ...bankAccount };

    if (bankAccount._id) {
      persistenceBankAccount._id = new Types.ObjectId(bankAccount._id);
    }
    if (bankAccount.userId) {
      persistenceBankAccount.userId = new Types.ObjectId(bankAccount.userId);
    }

    return persistenceBankAccount;
  }
}
