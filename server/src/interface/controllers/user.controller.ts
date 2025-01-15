import type { RequestHandler } from "express";
import fs from "fs";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { userRepository } from "../../infrastructure/repositories/UserRepository";
import type { User } from "../../infrastructure/database/models/UserModel";

export const fetchMyProfile: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const username = req.user.username;
    const userData = await userRepository.fetchProfileDetails(username);

    res.json(userData);
  } catch (error) {
    next(error);
  }
};

export const fetchMyData: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const userData = await userRepository.findById(req.user._id, {
      firstname: 1,
      lastname: 1,
      username: 1,
      email: 1,
      mobile: 1,
      gender: 1,
      dob: 1,
      image: 1,
    });

    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

export const fetchProfile: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const username = req.params.username;
    const userData = await userRepository.fetchProfileDetails(username);
    if (!userData) throw new HttpError(404, "Not found");
    const isFollowing = await userRepository.checkIsFollowing(
      req.user._id,
      userData._id
    );

    res.json({ ...userData, isFollowing });
  } catch (error) {
    next(error);
  }
};

export const updateProfile: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const {
      username,
      firstname,
      lastname,
      mobile,
      dob,
      gender,
      password,
      newPassword,
    } = req.body as Partial<User> & { newPassword: string };
    const image = req.file?.path.replace("public", "");
    let existImage: string | undefined;

    if (!firstname) throw new HttpError(400, "Please enter firstname.");
    else if (!lastname) throw new HttpError(400, "Please enter lastname.");
    else if (!username) throw new HttpError(400, "Please enter username.");
    else if (!mobile) throw new HttpError(400, "Please enter mobile number.");
    else if (!password) throw new HttpError(400, "Please enter password.");

    const user = await userRepository.findById(req.user._id, null, true);
    if (!user) throw new HttpError(401, "Unauthorized");

    const userVerified = await userRepository.verifyUser(
      user.username,
      password
    );

    if (!userVerified)
      throw new HttpError(400, "Invalid password. Please try again");

    if (image && user.image) existImage = user.image;

    user.username = username;
    user.firstname = firstname;
    user.lastname = lastname;
    user.mobile = mobile;
    user.dob = dob;
    user.gender = gender;
    user.password = password;
    user.image = image;
    await user.save();

    if (existImage) {
      fs.unlink("public" + existImage, (err) => {
        if (err) console.log("Image is not deleted");
      });
    }

    res.status(200).json({ message: "Updated profile successfully" });
  } catch (error) {
    next(error);
  }
};

export const followUser: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    await userRepository.followUser(req.user._id, req.params.userId);

    res
      .status(200)
      .json({ userId: req.params.userId, message: "Followed successfully" });
  } catch (error) {
    next(error);
  }
};

export const unfollowUser: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    await userRepository.unfollowUser(req.user._id, req.params.userId);

    res
      .status(200)
      .json({ userId: req.params.userId, message: "Unfollowed successfully" });
  } catch (error) {
    next(error);
  }
};
