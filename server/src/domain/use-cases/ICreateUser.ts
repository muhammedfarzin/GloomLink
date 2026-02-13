import { User } from "../entities/User";

export interface ICreateUser {
  execute(input: CreateUserInput): Promise<User>;
}

export interface CreateUserInput {
  firstname: string;
  lastname?: string;
  username: string;
  email: string;
  mobile: string;
  password: string;
  authType: "email" | "google";
}
