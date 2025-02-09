import type { Socket } from "socket.io";
import { Message } from "../../infrastructure/database/models/MessageModel";
import { urlPattern } from "../../shared/regexPatterns";
import { conversationRepository } from "../../infrastructure/repositories/ConversationRepository";
import { activeUsers } from "../websocket";

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
      if (type !== "text" && type !== "image")
        throw new Error("Invalid message type");

      const conversationId =
        await conversationRepository.findConversationIdByUsername(
          username,
          this.socket.user.username
        );

      if (!conversationId) throw new Error("Conversation not found");

      const messageDocument = await conversationRepository.addMessage(
        conversationId,
        this.socket.user._id,
        {
          message,
          image,
          type,
        }
      );

      const responseMessage = { ...messageDocument, from: this.username };
      const targetUsers = [...activeUsers[username].values()] as string[];

      this.socket.emit("send-message-success", responseMessage);
      this.socket.to(targetUsers).emit("send-message", responseMessage);
    } catch (error: any) {
      this.socket.emit("error-send-message", error.message);
    }
  };
}
