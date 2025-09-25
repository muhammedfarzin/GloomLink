import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IFileStorageService } from "../services/IFileStorageService";
import { User } from "../../domain/entities/User";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { UpdateProfileInputDto } from "../../interface/validation/profileSchemas";
import { IPasswordHasher } from "../services/IPasswordHasher";

export interface UpdateProfileInput extends UpdateProfileInputDto {
  userId: string;
  profileImageFile?: Express.Multer.File;
}

export class UpdateProfile {
  constructor(
    private userRepository: IUserRepository,
    private fileStorageService: IFileStorageService,
    private passwordHasher: IPasswordHasher
  ) {}

  async execute(input: UpdateProfileInput): Promise<User> {
    const { userId, profileImageFile, ...updates } = input;
    const currentUser = await this.userRepository.findById(userId);

    if (!currentUser) {
      throw new HttpError(404, "User not found or has been removed");
    }

    // ---Validating User---
    if (currentUser.authType === "email") {
      if (!updates.password) throw new HttpError(400, "Password is required");

      const isPasswordMatch = await this.passwordHasher.compare(
        updates.password,
        currentUser.password
      );

      if (!isPasswordMatch) {
        throw new HttpError(401, "Password does not matching with our records");
      }

      delete updates.password;

      if (updates.newPassword) {
        updates.password = await this.passwordHasher.hash(updates.newPassword);
        delete updates.newPassword;
      }
    }

    // ---Checking username already taken---
    if (currentUser.username !== updates.username) {
      const existingUser = await this.userRepository.findByUsername(
        updates.username
      );
      if (existingUser && existingUser._id !== userId) {
        throw new HttpError(409, "This username is already taken.");
      }
    }

    // ---Uploading new profile image URL---
    let imageUrl: string | undefined = undefined;
    if (profileImageFile) {
      const uploadedMedia = await this.fileStorageService.upload(
        [profileImageFile],
        "profile"
      );
      imageUrl = uploadedMedia[0]?.url;
    }

    const finalUpdates: UpdateProfileInputDto & { image?: string } = {
      ...updates,
    };

    if (imageUrl) {
      finalUpdates.image = imageUrl;
    }

    const updatedUser = await this.userRepository.update(userId, finalUpdates);
    if (!updatedUser) {
      throw new HttpError(500, "Failed to update profile.");
    }
    if (imageUrl && currentUser.image) {
      await this.fileStorageService.delete([currentUser.image], "image");
    }

    return updatedUser;
  }
}
