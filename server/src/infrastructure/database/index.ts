import mongoose from "mongoose";
import "dotenv/config";
import { logger } from "../logging/logger";

const mongoURI = process.env.MONGO_URI;

export const connectDatabase = async () => {
  try {
    if (!mongoURI) {
      throw new Error("Please add MONGO_URI to .env");
    }

    await mongoose.connect(mongoURI);
    logger.info("Connected to database");
  } catch (error) {
    logger.error("Database connection failed", { error });
    process.exit(1);
  }
};
