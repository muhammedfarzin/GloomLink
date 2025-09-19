import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserModel } from "../database/models/UserModel";
import { UserMapper } from "../database/mappers/UserMapper";
import bcrypt from "bcryptjs";
import { HttpError } from "../errors/HttpError";
import {
  isObjectIdOrHexString,
  Types,
  type ProjectionType,
  type Schema,
} from "mongoose";
import { FollowModel } from "../database/models/FollowModel";
import { extractKeywords } from "../../application/services/keyword.service";

export class UserRepository implements IUserRepository {
  async create(userData: Partial<User>): Promise<User> {
    const userToPersist = UserMapper.toPersistence(userData);
    const newUserModel = new UserModel(userToPersist);
    const savedUser = await newUserModel.save();
    return UserMapper.toDomain(savedUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userModel = await UserModel.findOne({ email });
    return userModel ? UserMapper.toDomain(userModel) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const userModel = await UserModel.findOne({ username });
    return userModel ? UserMapper.toDomain(userModel) : null;
  }

  async findById(id: string): Promise<User | null> {
    const userModel = await UserModel.findById(id);
    return userModel ? UserMapper.toDomain(userModel) : null;
  }

  async findByIdentifier(identifier: string): Promise<User | null> {
    const userModel = await UserModel.findOne({
      $or: [
        { username: identifier },
        { email: identifier },
        { mobile: identifier },
      ],
    });
    return userModel ? UserMapper.toDomain(userModel) : null;
  }

  async checkUserExist(
    query: Pick<User, "username" | "email" | "mobile">
  ): Promise<{ exist: false } | { exist: true; data: User; field: string }> {
    const { username, email, mobile } = query;

    let user = await UserModel.findOne({ username });
    if (user) {
      return {
        exist: true,
        field: "username",
        data: UserMapper.toDomain(user),
      };
    }

    user = await UserModel.findOne({ email });
    if (user) {
      return { exist: true, field: "email", data: UserMapper.toDomain(user) };
    }

    user = await UserModel.findOne({ mobile });
    if (user) {
      return { exist: true, field: "mobile", data: UserMapper.toDomain(user) };
    }

    return { exist: false };
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const userToPersist = UserMapper.toPersistence(userData);
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: userToPersist },
      { new: true }
    );
    return updatedUser ? UserMapper.toDomain(updatedUser) : null;
  }
}
