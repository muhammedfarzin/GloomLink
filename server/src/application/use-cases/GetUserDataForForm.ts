import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserFormViewDto } from "../dtos/UserFormViewDto";
import { UserMapper } from "../../infrastructure/database/mappers/UserMapper";
import { HttpError } from "../../infrastructure/errors/HttpError";

export class GetUserDataForForm {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<UserFormViewDto> {
    const user = await this.userRepository.findById(userId);
    if (!user || user.status === "not-verified") {
      throw new HttpError(404, "User not found or has been removed");
    }
    return UserMapper.toFormView(user);
  }
}
