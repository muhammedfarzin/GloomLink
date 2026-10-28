import { inject, injectable } from "inversify";
import { TYPES } from "@/shared/types";
import { UserActivity } from "@/domain/entities/UserActivity";
import type { IUserActivityRepository } from "@/domain/repositories/IUserActivityRepository";
import type {
  IRecordUserActivity,
  RecordUserActivityInput,
} from "@/domain/use-cases/IRecordUserActivity";

@injectable()
export class RecordUserActivity implements IRecordUserActivity {
  constructor(
    @inject(TYPES.UserActivityRepository)
    private userActivityRepository: IUserActivityRepository,
  ) {}

  async execute(input: RecordUserActivityInput): Promise<UserActivity> {
    const interactionToCreate = new UserActivity({
      ...input,
      id: crypto.randomUUID(),
      metadata: input.metadata ?? {},
    });

    return this.userActivityRepository.create(interactionToCreate);
  }
}
