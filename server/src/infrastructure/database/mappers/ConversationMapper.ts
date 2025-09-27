import { Types } from "mongoose";
import { Conversation } from "../../../domain/entities/Conversation";
import { ConversationDocument } from "../models/ConversationModel";
import { ConversationListDto } from "../../../application/dtos/ConversationListDto";

export class ConversationMapper {
  public static toDomain(
    conversationModel: ConversationDocument
  ): Conversation {
    return {
      _id: conversationModel._id.toString(),
      participants: conversationModel.participants.map((id) => id.toString()),
    };
  }

  public static toPersistence(conversation: Partial<Conversation>): any {
    const persistenceConversation: any = {
      ...conversation,
      participants: conversation.participants?.map(
        (id) => new Types.ObjectId(id)
      ),
    };

    if (conversation._id) {
      persistenceConversation._id = new Types.ObjectId(conversation._id);
    }

    return persistenceConversation;
  }

  public static toListView(conversation: any): ConversationListDto {
    return {
      _id: conversation._id?.toString(),
      conversationId: conversation.conversationId?.toString(),
      username: conversation.username,
      firstname: conversation.firstname,
      lastname: conversation.lastname,
      image: conversation.image,
      unread: conversation.unread,
      lastMessageTime: conversation.lastMessageTime,
      type: "conversation",
    };
  }
}
