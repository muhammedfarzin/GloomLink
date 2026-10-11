import { Mapper } from "./Mapper";
import { injectable } from "inversify";
import { Conversation } from "@/domain/entities/Conversation";
import type {
  ConversationType,
  ConversationList,
} from "@/domain/models/Conversation";
import type { ConversationDocument } from "../database/models/ConversationModel";

@injectable()
export class ConversationMapper extends Mapper<
  Conversation,
  ConversationType | ConversationDocument
> {
  public toDomain(
    conversation: ConversationType | ConversationDocument,
  ): Conversation {
    return new Conversation({
      id: conversation.id,
      participants: conversation.participants.map((p) => p.toString()),
    });
  }

  public toPersistence(conversation: Conversation): ConversationType {
    return {
      id: conversation.getId(),
      participants: conversation.getParticipants(),
    };
  }

  public toResponse(conversation: any): ConversationList {
    return {
      id: conversation.id?.toString(),
      participantId: conversation.participantId?.toString(),
      username: conversation.username,
      firstname: conversation.firstname,
      lastname: conversation.lastname,
      imageUrl: conversation.imageUrl,
      unread: conversation.unread || 0,
      lastMessageTime: conversation.lastMessageTime,
      type: "conversation",
    };
  }
}
