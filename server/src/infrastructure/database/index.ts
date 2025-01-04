import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const mongoURI = process.env.MONGO_URI;

export const connectDatabase = async () => {
  try {
    if (!mongoURI) {
      throw new Error("Please add MONGO_URI to .env");
    }

    await mongoose.connect(mongoURI);
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
};
