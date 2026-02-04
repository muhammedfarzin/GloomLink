import mongoose from "mongoose";
import z from "zod";

type ValidateRequired = (
  fieldName: string,
  defaultMessage?: string
) => { error: z.core.$ZodErrorMap<z.core.$ZodIssueInvalidType<unknown>> };

export const validateRequiredString: ValidateRequired = (
  fieldName: string,
  defaultMessage?: string
) => {
  return {
    error: (issue) => {
      if (issue.input === undefined) {
        return `${fieldName} is required`;
      }
      if (typeof issue.input !== "string") {
        return `${fieldName} must be a string`;
      }
      return defaultMessage || `Invalid ${fieldName.toLowerCase()}`;
    },
  };
};

export const isValidObjectId = (str: string) =>
  mongoose.Types.ObjectId.isValid(str) &&
  String(new mongoose.Types.ObjectId(str)) === str;
