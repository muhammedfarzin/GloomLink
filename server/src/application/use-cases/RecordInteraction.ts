import { inject, injectable } from "inversify";
import { TYPES } from "../../shared/types";
import { IInteractionRepository } from "../../domain/repositories/IInteractionRepository";
import { Interaction } from "../../domain/entities/Interaction";

@injectable()
export class RecordInteraction {
  constructor(
    @inject(TYPES.InteractionRepository)
    private interactionRepository: IInteractionRepository
  ) {}

  async execute(
    userId: string,
    postId: string,
    type: "view" | "like" | "comment" | "save"
  ): Promise<Interaction> {
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
