import { Types } from "mongoose";
import { Message } from "../../../domain/entities/Message";
import { MessageDocument } from "../models/MessageModel";

export class MessageMapper {
  public static toDomain(messageModel: MessageDocument): Message {
    const messageObject =
      messageModel.toObject<MessageDocument>?.() || messageModel;

    return {
      ...messageObject,
      _id: messageObject._id?.toString(),
      conversation: messageObject.conversation?.toString(),
      from: messageObject.from?.toString(),
    };
  }

  public static toPersistence(message: Partial<Message>): any {
    const persistenceMessage: any = { ...message };

    if (message._id) {
      persistenceMessage._id = new Types.ObjectId(message._id);
    }
    if (message.conversation) {
      persistenceMessage.conversation = new Types.ObjectId(
        message.conversation
      );
    }
    if (message.from) {
      persistenceMessage.from = new Types.ObjectId(message.from);
    }

    return persistenceMessage;
  }
}
