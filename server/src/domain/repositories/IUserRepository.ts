import { User } from "../entities/User";

export interface IUserRepository {
  create: (data: Partial<User>) => Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  checkUserExist: (
    query: Pick<User, "username" | "email" | "mobile">
  ) => Promise<
    { exist: false; data: never } | { exist: true; data: { field: string } }
  >;
}
