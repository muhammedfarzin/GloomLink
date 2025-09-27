import type { Socket } from "socket.io";
import { Message } from "../../infrastructure/database/models/MessageModel";
import { urlPattern } from "../../shared/regexPatterns";
import { conversationRepository } from "../../infrastructure/repositories/ConversationRepository";
import { activeUsers } from "../websocket";
import { Error, Types } from "mongoose";

export class SocketController {
  socket: Socket;
  username: string;

  constructor(socket: Socket) {
    this.socket = socket;
    this.username = socket.user.username;
  }

  handleSendMessage = async (
    username: string,
    data: Partial<Pick<Message, "message" | "image" | "type">>
  ) => {
    try {
      const { message, image, type } = data;
      if (!message?.trim() && !image?.trim())
        throw new Error("Message or image either one is required");
      if (image && !urlPattern.test(image))
        throw new Error("Invalid image URL");
      if (type !== "text" && type !== "image" && type !== "post")
        throw new Error("Invalid message type");

      const conversationId =
        await conversationRepository.findConversationIdByUsername(
          username,
          this.socket.user.username
        );

      if (!conversationId) throw new Error("Conversation not found");

      const messageDocument = await conversationRepository.addMessage(
        conversationId,
        this.socket.user.id,
        {
          message,
          image,
          type,
        }
      );

      const responseMessage = {
        ...messageDocument,
        from: this.username,
        to: username,
      };
      const targetUserSocketIds = activeUsers[username];

      this.socket.emit("send-message-success", responseMessage);

      if (!targetUserSocketIds || !targetUserSocketIds.size) return;

      const targetUsers = [...targetUserSocketIds.values()] as string[];
      this.socket.to(targetUsers).emit("send-message", responseMessage);
    } catch (error: any) {
      this.socket.emit("error-send-message", error.message, data);
    }
  };

  markAsSeen = async (
    message: Omit<Message, "conversation" | "from"> & {
      _id: string;
      from: string;
    }
  ) => {
    conversationRepository.markAsRead(message._id, this.socket.user.id);
    const targetUserSocketIds = activeUsers[message.from];
    if (targetUserSocketIds && targetUserSocketIds.size) {
      this.socket.to([...targetUserSocketIds]).emit("message-seen", message);
    }
  };
}
