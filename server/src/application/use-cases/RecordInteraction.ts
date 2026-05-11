import { inject, injectable } from "inversify";
import { TYPES } from "@/shared/types";
import { Interaction } from "@/domain/entities/Interaction";
import type { IInteractionRepository } from "@/domain/repositories/IInteractionRepository";
import type {
  IRecordInteraction,
  RecordInteractionInput,
} from "@/domain/use-cases/IRecordInteraction";

@injectable()
export class RecordInteraction implements IRecordInteraction {
  constructor(
    @inject(TYPES.InteractionRepository)
    private interactionRepository: IInteractionRepository,
  ) {}

  async execute(input: RecordInteractionInput): Promise<Interaction> {
    const { userId, postId, type } = input;
    const weightMap = {
      view: 1,
      like: 3,
      comment: 5,
      save: 7,
    };

    const interactionToCreate = new Interaction({
      id: crypto.randomUUID(),
      userId,
      postId,
      type,
      weight: weightMap[type],
    });

    return this.interactionRepository.create(interactionToCreate);
  }
}
