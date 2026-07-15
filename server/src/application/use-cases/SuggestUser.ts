import { inject } from "inversify";
import { TYPES } from "@/shared/types";
import type { UserCompact } from "@/domain/models/User";
import type { IUserRepository } from "@/domain/repositories/IUserRepository";
import type {
  ISuggestUser,
  SuggestUserInput,
} from "@/domain/use-cases/ISuggestUser";

export class SuggestUser implements ISuggestUser {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
  ) {}

  execute(input: SuggestUserInput): Promise<UserCompact[]> {
    return this.userRepository.findSuggestions(input);
  }
}
