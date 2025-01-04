import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { type User  } from "../../infrastructure/database/models/UserModel.js";
import { HttpError } from "../../infrastructure/errors/HttpError.js";
import { userRepository } from "../../infrastructure/repositories/UserRepository.js";

export const login: RequestHandler = async (req, res, next) => {
  const { username, password }: Pick<User, "username" | "password"> =
    req.body;

  try {
    if (!username || !password) {
      throw new HttpError(400, "Username and password are required.");
    }

    const authorized = await userRepository.verifyUser(username, password);
    if (authorized) {
      const token = jwt.sign({ username }, process.env.JWT_SECRET || "secret", {
        expiresIn: "5m",
      });

      res.status(200).json({ token, message: "Login successful" });
    } else {
      throw new HttpError(403, "Invalid username or password");
    }
  } catch (error) {
      next(error);
  }
};
