import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserMapper } from "../../infrastructure/database/mappers/UserMapper";
import { UserResponseDto } from "../dtos/UserResponseDto";

export interface GetAdminUsersInput {
  filter: "all" | "active" | "blocked";
  page: number;
  limit: number;
  searchQuery?: string;
}

export class GetAdminUsers {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: GetAdminUsersInput): Promise<UserResponseDto[]> {
    const user = await this.userRepository.findAll(input);
    return user.map(UserMapper.toResponse);
  }
}
