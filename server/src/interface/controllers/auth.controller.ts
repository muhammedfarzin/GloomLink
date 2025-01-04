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

export const signup: RequestHandler = async (req, res, next) => {
  const {
    firstname,
    lastname,
    username,
    mobile,
    email,
    gender,
    password,
  }: User = req.body;
  let dob: Date | undefined;

  try {
    if (
      !firstname ||
      !lastname ||
      !username ||
      !mobile ||
      !email ||
      !password
    ) {
      throw new HttpError(400, "All fields are required.");
    }

    if (gender && gender !== "m" && gender !== "f") {
      throw new HttpError(400, "Invalid gender");
    }
    if (req.body.dob) {
      dob = new Date(req.body.dob);
    }

    const newUser = await userRepository.create({
      firstname,
      lastname,
      username,
      mobile,
      email,
      password,
      gender,
      dob,
    });

    const {password: _, ...resUser} = newUser.toObject();

    res.status(201).json({ user: resUser, message: "User created" });
  } catch (err) {
    next(err);
  }
};
