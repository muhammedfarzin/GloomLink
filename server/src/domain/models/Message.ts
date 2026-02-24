export interface CompactMessage {
  id: string;
  conversationId: string;
  message?: string;
  image?: string;
  senderId: string;
  senderUsername?: string;
  status: "sent" | "delivered" | "seen";
  type: "text" | "image" | "post";
  createdAt: Date;
  updatedAt: Date;
}
