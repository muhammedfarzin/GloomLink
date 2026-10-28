import { Mapper } from "./Mapper";
import { injectable } from "inversify";
import { UserActivity } from "@/domain/entities/UserActivity";
import type { UserActivityType } from "@/domain/models/UserActivity";
import type { UserActivityDocument } from "../database/models/UserActivityModel";

@injectable()
export class UserActivityMapper extends Mapper<
  UserActivity,
  UserActivityType | UserActivityDocument
> {
  public toDomain(
    interaction: UserActivityType | UserActivityDocument,
  ): UserActivity {
    return new UserActivity({
      id: interaction.id.toString(),
      userId: interaction.userId.toString(),
      targetId: interaction.targetId.toString(),
      targetType: interaction.targetType,
      metadata: interaction.metadata,
      action: interaction.action,
      createdAt: interaction.createdAt,
    });
  }

  public toPersistence(interaction: UserActivity): UserActivityType {
    return {
      id: interaction.getId(),
      userId: interaction.getUserId(),
      targetId: interaction.getTargetId(),
      targetType: interaction.getTargetType(),
      metadata: interaction.getMetadata(),
      action: interaction.getAction(),
      createdAt: interaction.getCreatedAt(),
    };
  }
}
