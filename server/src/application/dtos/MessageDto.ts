export interface MessageResponseDto {
  readonly id: string;
  readonly conversationId: string;
  message?: string;
  readonly image?: string;
  readonly senderId: string;
  senderUsername?: string;
  status: "sent" | "delivered" | "seen";
  readonly type: "text" | "image" | "post";
  readonly createdAt: Date;
  updatedAt: Date;
}
