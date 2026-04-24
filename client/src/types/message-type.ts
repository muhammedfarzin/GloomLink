export interface MessageType {
  id: string;
  conversationId: string;
  message?: string;
  image?: string;
  type: "text" | "image" | "post";
  senderId: string;
  senderUsername?: string;
  status: "sent" | "seen" | "pending";
  createdAt: string;
}
