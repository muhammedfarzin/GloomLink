import { Mapper } from "./Mapper";
import { injectable } from "inversify";
import { Interaction } from "@/domain/entities/Interaction";
import type { InteractionType } from "@/domain/models/Interaction";
import type { InteractionDocument } from "../database/models/InteractionModel";

@injectable()
export class InteractionMapper extends Mapper<
  Interaction,
  InteractionType | InteractionDocument
> {
  public toDomain(
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

  public toPersistence(interaction: Interaction): InteractionType {
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
