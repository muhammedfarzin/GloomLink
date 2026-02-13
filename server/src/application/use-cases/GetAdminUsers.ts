import { injectable, inject } from "inversify";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserMapper } from "../../infrastructure/mappers/UserMapper";
import { UserWithStatusDto } from "../dtos/UserDto";
import {
  IGetAdminUsers,
  type GetAdminUsersInput,
} from "../../domain/use-cases/IGetAdminUsers";
import { TYPES } from "../../shared/types";

@injectable()
export class GetAdminUsers implements IGetAdminUsers {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
  ) {}

  async execute(input: GetAdminUsersInput): Promise<UserWithStatusDto[]> {
    const user = await this.userRepository.findAll(input);
    return user.map(UserMapper.toResponseWithStatus);
  }
}
