import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { HttpError } from "../../infrastructure/errors/HttpError";

export interface SignInWithGoogleInput {
  name?: string;
  email?: string;
  uid: string;
}

export class SignInWithGoogle {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: SignInWithGoogleInput): Promise<User> {
    if (!input.email) {
      throw new HttpError(400, "Email not provided by Google authentication");
    }

    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      if (existingUser.authType !== "google") {
        throw new HttpError(
          400,
          "This email is registered with a different sign-in method."
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

    const newUser: Partial<User> = {
      firstname,
      lastname,
      username,
      email: input.email,
      password: input.uid,
      status: "active",
      authType: "google",
    };

    const createdUser = await this.userRepository.create(newUser);
    return createdUser;
  }
}
