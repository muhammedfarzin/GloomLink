import { User } from "../entities/User";
import { EnrichedPost } from "./IPostRepository";

export interface IUserRepository {
  create: (data: Partial<User>) => Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByIdentifier(identifier: string): Promise<User | null>;
  checkUserExist: (
    query: Pick<User, "username" | "email" | "mobile">
  ) => Promise<{ exist: false } | { exist: true; data: User; field: string }>;
  update(id: string, userData: Partial<User>): Promise<User | null>;
  findSavedPosts(
    userId: string,
    page: number,
    limit: number
  ): Promise<EnrichedPost[]>;
}
