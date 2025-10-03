import { injectable, inject } from "inversify";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserMapper } from "../../infrastructure/database/mappers/UserMapper";
import { UserResponseDto } from "../dtos/UserResponseDto";
import { TYPES } from "../../shared/types";

export interface GetAdminUsersInput {
  filter: "all" | "active" | "blocked";
  page: number;
  limit: number;
  searchQuery?: string;
}

@injectable()
export class GetAdminUsers {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) {}

  async execute(input: GetAdminUsersInput): Promise<UserResponseDto[]> {
    const user = await this.userRepository.findAll(input);
    return user.map(UserMapper.toResponse);
  }
}
