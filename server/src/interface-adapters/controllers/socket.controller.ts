import type { Socket } from "socket.io";
import type { CompactMessage } from "../../domain/models/Message";
import type { ISendMessage } from "../../domain/use-cases/ISendMessage";
import type { IMarkMessageAsSeen } from "../../domain/use-cases/IMarkMessageAsSeen";
import { activeUsers } from "../websocket";
import {
  markAsSeenSchema,
  sendMessageSchema,
} from "../validation/socketSchemas";
import container from "../../shared/inversify.config";
import { TYPES } from "../../shared/types";

export class SocketController {
  socket: Socket;
  username: string;

  constructor(socket: Socket) {
    this.socket = socket;
    this.username = socket.user.username;
  }

  handleSendMessage = async (
    conversationId: string,
    data: Partial<Pick<CompactMessage, "message" | "image" | "type">>,
  ) => {
    try {
      const { message, image, type } = sendMessageSchema.parse({
        ...data,
        conversationId,
      });

      const sendMessageUseCase = container.get<ISendMessage>(
        TYPES.ISendMessage,
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

      const markAsSeenUseCase = container.get<IMarkMessageAsSeen>(
        TYPES.IMarkMessageAsSeen,
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
        ...messages,
      );
    }
  };
}
