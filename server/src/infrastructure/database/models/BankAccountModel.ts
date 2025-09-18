import { type Document, model, Schema } from "mongoose";

export interface BankAccountType {
  _id: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  name: string;
  accountNumber: string;
  ifsc: string;
}

export type BankAccountDocument = BankAccountType & Document;

export const ifscRegex = /^[A-Z]{4}0\d{6}$/;
export const bankAccountNumberRegex = /^\d+$/;

const bankAccountSchema = new Schema<BankAccountType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          return bankAccountNumberRegex.test(value);
        },
        message: () => "Invalid account number",
      },
    },
    ifsc: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          return ifscRegex.test(value);
        },
        message: () => `Invalid IFSC code`,
      },
    },
  },
  { timestamps: true }
);

export const BankAccountModel = model("BankAccount", bankAccountSchema);
