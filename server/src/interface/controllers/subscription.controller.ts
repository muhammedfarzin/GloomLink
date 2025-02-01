import { RequestHandler } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { subscriptionRepository } from "../../infrastructure/repositories/SubscriptionRepository";
import {
  bankAccountNumberRegex,
  ifscRegex,
} from "../../infrastructure/database/models/BankAccountModel";

export const enableSubscription: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const userId = req.user._id;
    const {
      amount,
      name,
      accNumber: accountNumber,
    }: Partial<Record<string, string> & { amount: number }> = req.body;
    const ifsc: string | undefined = req.body.ifsc?.toUpperCase();

    if (!amount || isNaN(Number(amount)))
      throw new HttpError(400, "Please enter a valid amount");
    if (typeof name !== "string" || !name.trim())
      throw new HttpError(400, "Please enter a valid name");
    if (!accountNumber || !bankAccountNumberRegex.test(accountNumber))
      throw new HttpError(400, "Please enter a valid account number");
    if (!ifsc || !ifscRegex.test(ifsc))
      throw new HttpError(400, "Please enter a valid IFSC code");

    await subscriptionRepository.addSubscription(userId, {
      amount,
      name,
      accountNumber,
      ifsc,
    });

    res.status(201).json({ message: "Subscription enabled" });
  } catch (error) {
    next(error);
  }
};

export const checkEligibility: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const isEligible = await subscriptionRepository.checkEligibility(
      req.user._id
    );

    res
      .status(200)
      .json({
        isEligible,
        message: `You are ${isEligible ? "" : "not "}eligible for this feature`,
      });
  } catch (error) {
    next(error);
  }
};
