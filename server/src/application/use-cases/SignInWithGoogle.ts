import { injectable, inject } from "inversify";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";
import { ExternalAuthUser } from "../../domain/services/IExternalAuthService";
import { ISignInWithGoogle } from "../../domain/use-cases/ISignInWithGoogle";

@injectable()
export class SignInWithGoogle implements ISignInWithGoogle {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
  ) {}

  async execute(input: ExternalAuthUser): Promise<User> {
    if (!input.email) {
      throw new HttpError(400, "Email not provided by Google authentication");
    }

    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      if (existingUser.getAuthType() !== "google") {
        throw new HttpError(
          400,
          "This email is registered with a different sign-in method.",
        );
      }
      return existingUser;
    }

    // ---Create new User
    const [firstname, ...restName] = input.name?.split(" ") || [
      "Anonymous",
      "User",
    ];
    const lastname = restName.join(" ") || "";

    const username = `${input.email.split("@")[0]}-${Date.now()
      .toString()
      .slice(-4)}${Math.random() * 90000}`;

    const newUser = new User({
      userId: crypto.randomUUID(),
      firstname,
      lastname,
      username,
      email: input.email,
      passwordHash: input.externalId,
      status: "active",
      authType: "google",
    });

    const createdUser = await this.userRepository.create(newUser);
    return createdUser;
  }
}
