import { injectable, inject } from "inversify";
import { User } from "../../domain/entities/User";
import { UserNotFoundError } from "../../domain/errors/NotFoundErrors";
import { ValidationError } from "../../domain/errors/ValidationError";
import { InvalidCredentialsError } from "../../domain/errors/AuthErrors";
import { ConflictError } from "../../domain/errors/ConflictError";
import { TYPES } from "../../shared/types";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type { IFileStorageService } from "../../domain/services/IFileStorageService";
import type { IPasswordHasher } from "../../domain/services/IPasswordHasher";
import type {
  IUpdateProfile,
  UpdateProfileInput,
} from "../../domain/use-cases/IUpdateProfile";

@injectable()
export class UpdateProfile implements IUpdateProfile {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IFileStorageService)
    private fileStorageService: IFileStorageService,
    @inject(TYPES.IPasswordHasher) private passwordHasher: IPasswordHasher,
  ) {}

  async execute(input: UpdateProfileInput): Promise<User> {
    const { userId, profileImageFile } = input;
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    // ---Validating User---
    if (user.getAuthType() === "email") {
      if (!input.password) throw new ValidationError("Password is required");

      const isPasswordMatch = await this.passwordHasher.compare(
        input.password,
        user.getPasswordHash(),
      );

      if (!isPasswordMatch) {
        throw new InvalidCredentialsError();
      }

      delete input.password;

      if (input.newPassword) {
        const passwordHash = await this.passwordHasher.hash(input.newPassword);
        user.updatePasswordHash(passwordHash);
      }
    }

    // ---Checking username already taken---
    if (user.getUsername() !== input.username) {
      const existingUser = await this.userRepository.findByUsername(
        input.username,
      );
      if (existingUser && existingUser.getId() !== userId) {
        throw new ConflictError("This username is already taken");
      }

      user.changeUsername(input.username);
    }

    // ---Uploading new profile image URL---
    let newImageUrl: string | null = null;
    const currentImgUrl = user.getImageUrl();

    if (profileImageFile) {
      const uploadedMedia = await this.fileStorageService.upload(
        [profileImageFile],
        "profile",
      );
      newImageUrl = uploadedMedia[0]?.url;
    }

    if (newImageUrl) {
      user.updateImage(newImageUrl);
    }

    user.changeName(input.firstname, input.lastname);
    user.updateMobile(input.mobile);
    user.updateGender(input.gender);
    user.updateDateOfBirth(input.dob);

    const updatedUser = await this.userRepository.update(userId, user);
    if (!updatedUser) {
      throw new Error("Failed to update profile.");
    }

    if (newImageUrl && currentImgUrl) {
      await this.fileStorageService.delete([currentImgUrl], "image");
    }

    return updatedUser;
  }
}
