import { Interaction } from "../../domain/entities/Interaction";
import type { InteractionType } from "../../domain/models/Interaction";
import type { InteractionDocument } from "../database/models/InteractionModel";

export class InteractionMapper {
  public static toDomain(
    interaction: InteractionType | InteractionDocument,
  ): Interaction {
    return new Interaction({
      id: interaction.id.toString(),
      userId: interaction.userId.toString(),
      postId: interaction.postId.toString(),
      weight: interaction.weight,
      type: interaction.type,
      createdAt: interaction.createdAt,
    });
  }

  public static toPersistence(interaction: Interaction): InteractionType {
    return {
      id: interaction.getId(),
      userId: interaction.getUserId(),
      postId: interaction.getPostId(),
      weight: interaction.getWeight(),
      type: interaction.getType(),
      createdAt: interaction.getCreatedAt(),
    };
  }
}
