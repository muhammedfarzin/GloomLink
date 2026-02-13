import { inject, injectable } from "inversify";
import { TYPES } from "../../shared/types";
import { IInteractionRepository } from "../../domain/repositories/IInteractionRepository";
import { Interaction } from "../../domain/entities/Interaction";
import {
  IRecordInteraction,
  type RecordInteractionInput,
} from "../../domain/use-cases/IRecordInteraction";

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

    return this.interactionRepository.create({
      userId,
      postId,
      type,
      weight: weightMap[type],
    });
  }
}
