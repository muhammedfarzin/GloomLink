import { RequestHandler } from "express";
import type { User } from "../../infrastructure/database/models/UserModel.js";
import { HttpError } from "../../infrastructure/errors/HttpError.js";
import { userRepository } from "../../infrastructure/repositories/UserRepository.js";
import {
  generateToken,
  verifyToken,
  type TokensType,
  type TokenPayloadType,
} from "../../application/services/token.service.js";
import { otpRepository } from "../../infrastructure/repositories/OtpRepository.js";

export const login: RequestHandler = async (req, res, next) => {
  const { username, password }: Pick<User, "username" | "password"> = req.body;

  try {
    if (!username || !password) {
      throw new HttpError(400, "Username and password are required.");
    }

    const userData = await userRepository.verifyUser(username, password, true);

    if (!userData) {
      throw new HttpError(403, "Invalid username or password");
    } else if (userData.status === "blocked") {
      throw new HttpError(403, "Your account has been blocked");
    } else if (userData.status === "not-verified") {
      await otpRepository.resendOtp(userData.email);
    }

    const { password: _, ...resUser } = userData.toObject();

    const payload: TokenPayloadType = { role: "user", ...resUser };
    const tokens = generateToken(payload, userData.status !== "not-verified");

    res
      .status(200)
      .json({ userData: resUser, tokens, message: "Login successful" });
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

    const { password: _, ...resUser } = newUser.toObject();
    const tokens = generateToken({ role: "temp", ...resUser }, false);

    res
      .status(201)
      .json({ userData: resUser, tokens, message: "User created" });
  } catch (err) {
    next(err);
  }
};

export const resendOTP: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user")
      throw new HttpError(401, "Unauthorized");

    await otpRepository.resendOtp(req.user.email);
    res.status(200).json({ message: "Otp has been send successfully" });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user")
      throw new HttpError(401, "Unauthorized");

    const otp: string | undefined = req.body.otp;
    if (!otp) throw new HttpError(400, "Please enter a valid otp");

    const isOtpMatched = await otpRepository.verifyOtp(req.user, otp);

    if (!isOtpMatched) {
      throw new HttpError(400, "Invalid OTP, please try again");
    }

    await userRepository.updateById(req.user._id, { status: "active" });
    const updatedUser = await userRepository.findByUsername(req.user.username);
    if (!updatedUser) throw new HttpError(404, "User not found");

    const { role, ...userWithoutRole } = req.user;
    const tokens = generateToken({ role: "user", ...userWithoutRole });

    res.status(200).json({
      userData: updatedUser,
      tokens,
      message: "OTP verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken: RequestHandler = async (req, res, next) => {
  const { token } = req.body as { token?: string };

  try {
    if (!token) {
      throw new HttpError(400, "Refresh token is required.");
    }

    const decoded = verifyToken(token, "refresh");
    let newTokens: TokensType;

    if (!decoded) {
      throw new HttpError(403, "Invalid refresh token.");
    }

    if (decoded.role === "user") {
      const user = await userRepository.findByUsername(decoded.username);
      if (!user) {
        throw new HttpError(404, "User not found.");
      } else if (user.status === "blocked") {
        throw new HttpError(401, "Your account is blocked");
      }

      const { _id, email, firstname, lastname, username, mobile, status } =
        user;
      const resData = {
        _id: _id.toString(),
        email,
        firstname,
        lastname,
        username,
        mobile,
        status,
      };

      newTokens = generateToken({ role: "user", ...resData }, true);
    } else if (decoded.role === "admin") {
      newTokens = generateToken({
        role: "admin",
        username: decoded.username,
      });
    } else throw new HttpError(401, "Unauthorized");

    res.status(200).json({
      tokens: newTokens,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const adminLogin: RequestHandler = async (req, res, next) => {
  const { username, password } = req.body as {
    username?: string;
    password?: string;
  };

  try {
    if (!username || !password) {
      throw new HttpError(400, "Username and password are required.");
    }

    if (
      process.env.ADMIN_USERNAME !== username ||
      process.env.ADMIN_PASSWORD !== password
    ) {
      throw new HttpError(403, "Invalid username or password!");
    }

    const payload: TokenPayloadType = { role: "admin", username };
    const tokens = generateToken(payload);

    res
      .status(200)
      .json({ userData: { username }, tokens, message: "Login successful" });
  } catch (error) {
    next(error);
  }
};
