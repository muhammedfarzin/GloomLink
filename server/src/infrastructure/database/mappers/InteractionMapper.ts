import { InteractionDocument } from "../models/InteractionModel";
import { Interaction } from "../../../domain/entities/Interaction";
import { Types } from "mongoose";

export class InteractionMapper {
  public static toDomain(interactionModel: InteractionDocument): Interaction {
    return {
      ...interactionModel,
      _id: interactionModel._id.toString(),
      userId: interactionModel.userId.toString(),
      postId: interactionModel.postId.toString(),
    };
  }

  public static toPersistence(interaction: Partial<Interaction>): any {
    const persistenceInteraction: any = { ...interaction };

    if (interaction._id) {
      persistenceInteraction._id = new Types.ObjectId(interaction._id);
    }
    if (interaction.userId) {
      persistenceInteraction.userId = new Types.ObjectId(interaction.userId);
    }
    if (interaction.postId) {
      persistenceInteraction.postId = new Types.ObjectId(interaction.postId);
    }

    return persistenceInteraction;
  }
}
