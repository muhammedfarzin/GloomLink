export interface MessageType {
  id: string;
  message?: string;
  image?: string;
  type: "text" | "image" | "post";
  senderId: string;
  senderUsername?: string;
  to?: string;
  status: "sent" | "seen" | "pending";
  createdAt: string;
}
