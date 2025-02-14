import type {
  Document,
  Types,
  RootFilterQuery,
  ProjectionType,
} from "mongoose";
import type { Conversation } from "../../infrastructure/database/models/ConversationModel";
import { Message } from "../../infrastructure/database/models/MessageModel";

export interface IConversationRepository {
  create(participants: string[]): Promise<Types.ObjectId>;

  findOne(
    filter?: RootFilterQuery<Conversation> | undefined,
    projection?: ProjectionType<Conversation> | null | undefined
  ): Promise<(Document<unknown, {}, Conversation> & Conversation) | null>;

  findConversationId(
    participants: string[]
  ): Promise<Types.ObjectId | undefined>;

  findConversationIdByUsername(
    ...usernames: string[]
  ): Promise<Types.ObjectId | undefined>;

  fetchAllCoversations(userId: string): Promise<
    (Document<unknown, {}, Conversation> &
      Conversation & {
        _id: Types.ObjectId;
      })[]
  >;

  fetchConversationList(userId: string): Promise<any[]>;

  addMessage(
    conversation: Types.ObjectId,
    from: string,
    data: Partial<Pick<Message, "message" | "image">> & Pick<Message, "type">
  ): Promise<
    Message & {
      _id: Types.ObjectId;
    }
  >;

  validateConversationPermission(
    userId: string,
    conversationId: string
  ): Promise<Types.ObjectId | false>;

  fetchMessages(conversationId: Types.ObjectId): Promise<
    (Omit<Message, "from"> & {
      _id: Types.ObjectId;
      from: string;
    })[]
  >;

  markAsRead(messageId: Types.ObjectId, userId: string): Promise<void>;
}
