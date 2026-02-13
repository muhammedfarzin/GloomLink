import { Message } from "../entities/Message";

export interface ISendMessage {
  execute(input: SendMessageInput): Promise<Message>;
}

export interface SendMessageInput {
  conversationId: string;
  senderId: string;
  message?: string;
  type: "text" | "image" | "post";
  image?: string;
}
