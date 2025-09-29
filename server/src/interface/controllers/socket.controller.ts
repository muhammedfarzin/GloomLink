import type { Socket } from "socket.io";
import { Message } from "../../domain/entities/Message";
import { ConversationRepository } from "../../infrastructure/repositories/ConversationRepository";
import { activeUsers } from "../websocket";
import { MessageRepository } from "../../infrastructure/repositories/MessageRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { SendMessage } from "../../application/use-cases/SendMessage";
import { MarkMessageAsSeen } from "../../application/use-cases/MarkMessageAsSeen";
import {
  markAsSeenSchema,
  sendMessageSchema,
} from "../validation/socketSchemas";

export class SocketController {
  socket: Socket;
  username: string;

  constructor(socket: Socket) {
    this.socket = socket;
    this.username = socket.user.username;
  }

  handleSendMessage = async (
    conversationId: string,
    data: Partial<Pick<Message, "message" | "image" | "type">>
  ) => {
    try {
      const { message, image, type } = sendMessageSchema.parse({
        ...data,
        conversationId,
      });

      const messageRepository = new MessageRepository();
      const conversationRepository = new ConversationRepository();
      const userRepository = new UserRepository();

      const sendMessageUseCase = new SendMessage(
        messageRepository,
        conversationRepository,
        userRepository
      );

      const newMessage = await sendMessageUseCase.execute({
        message,
        image,
        type,
        senderId: this.socket.user.id,
        conversationId,
      });

      this.socket.to(conversationId).emit("send-message", newMessage);
      this.socket.emit("send-message-success", newMessage);
    } catch (error: any) {
      this.socket.emit("error-send-message", error.message, data);
    }
  };

  markAsSeen = async (...messages: { messageId?: string; from?: string }[]) => {
    try {
      const validatedMessages = markAsSeenSchema.parse(messages);

      const messageRepository = new MessageRepository();
      const conversationRepository = new ConversationRepository();

      const markAsSeenUseCase = new MarkMessageAsSeen(
        messageRepository,
        conversationRepository
      );

      for (const message of validatedMessages) {
        const updatedMessage = await markAsSeenUseCase.execute({
          messageId: message.messageId,
          viewerId: this.socket.user.id,
        });
        const senderSocketIds = activeUsers[message.from];
        if (senderSocketIds && senderSocketIds.size) {
          this.socket
            .to([...senderSocketIds])
            .emit("message-seen", updatedMessage);
        }
      }
    } catch (error: any) {
      this.socket.emit(
        "markAsSeenError",
        {
          message: error.message || "Something went wrong",
        },
        ...messages
      );
    }
  };
}
