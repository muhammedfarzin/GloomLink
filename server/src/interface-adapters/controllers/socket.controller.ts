import { inject, injectable } from "inversify";
import type { Socket, SocketActiveUsers } from "socket.io";
import type { CompactMessage } from "../../domain/models/Message";
import type { ISendMessage } from "../../domain/use-cases/ISendMessage";
import type { IMarkMessageAsSeen } from "../../domain/use-cases/IMarkMessageAsSeen";
import { TYPES } from "../../shared/types";
import { MessagePresenter } from "../presenters/MessagePresenter";
import {
  markAsSeenSchema,
  sendMessageSchema,
} from "../validation/socketSchemas";

@injectable()
export class SocketController {
  constructor(
    @inject(TYPES.SocketActiveUsers)
    private readonly activeUsers: SocketActiveUsers,
    @inject(TYPES.ISendMessage)
    private readonly sendMessageUseCase: ISendMessage,
    @inject(TYPES.IMarkMessageAsSeen)
    private readonly markAsSeenUseCase: IMarkMessageAsSeen,
  ) {}

  handleSendMessage = async (
    socket: Socket,
    conversationId: string,
    data: Partial<Pick<CompactMessage, "message" | "image" | "type">>,
  ) => {
    try {
      const validatedData = sendMessageSchema.parse({
        ...data,
        conversationId,
      });

      const newMessage = await this.sendMessageUseCase.execute({
        ...validatedData,
        senderId: socket.user.id,
        conversationId,
      });

      const resMessage = MessagePresenter.toResponse(newMessage);
      socket.to(conversationId).emit("incoming-message", resMessage);
      socket.emit("send-message-success", resMessage);
    } catch (error: any) {
      socket.emit("error-send-message", error.message, data);
    }
  };

  markAsSeen = async (
    socket: Socket,
    ...messages: { messageId?: string; senderUsername?: string }[]
  ) => {
    try {
      const validatedMessages = markAsSeenSchema.parse(messages);

      for (const message of validatedMessages) {
        const updatedMessage = await this.markAsSeenUseCase.execute({
          messageId: message.messageId,
          viewerId: socket.user.id,
        });
        const senderSocketIds = this.activeUsers[message.senderUsername];
        if (senderSocketIds && senderSocketIds.size) {
          socket
            .to([...senderSocketIds])
            .emit("message-seen", MessagePresenter.toResponse(updatedMessage));
        }
      }
    } catch (error: any) {
      socket.emit(
        "markAsSeenError",
        {
          message: error.message || "Something went wrong",
        },
        ...messages,
      );
    }
  };
}
