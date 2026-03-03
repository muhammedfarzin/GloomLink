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
import { MessagePresenter } from "../presenters/MessagePresenter";

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
      const validatedData = sendMessageSchema.parse({
        ...data,
        conversationId,
      });

      const sendMessageUseCase = container.get<ISendMessage>(
        TYPES.ISendMessage,
      );

      const newMessage = await sendMessageUseCase.execute({
        ...validatedData,
        senderId: this.socket.user.id,
        conversationId,
      });

      const resMessage = MessagePresenter.toResponse(newMessage);
      this.socket.to(conversationId).emit("incoming-message", resMessage);
      this.socket.emit("send-message-success", resMessage);
    } catch (error: any) {
      this.socket.emit("error-send-message", error.message, data);
    }
  };

  markAsSeen = async (
    ...messages: { messageId?: string; senderUsername?: string }[]
  ) => {
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
        const senderSocketIds = activeUsers[message.senderUsername];
        if (senderSocketIds && senderSocketIds.size) {
          this.socket
            .to([...senderSocketIds])
            .emit("message-seen", MessagePresenter.toResponse(updatedMessage));
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
