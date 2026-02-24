import type { CompactMessage } from "../models/Message";

export class Message {
  private readonly id: string;
  private readonly conversationId: string;
  private message?: string;
  private readonly image?: string;
  private readonly senderId: string;
  private senderUsername?: string;
  private status: "sent" | "delivered" | "seen";
  private readonly type: "text" | "image" | "post";
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(props: MessageProps) {
    if (!props.message && !props.image) {
      throw new Error("Message must have either a message or an image");
    }
    if (props.type === "text" && !props.message) {
      throw new Error("Text message must have a message");
    }
    if (props.type === "image" && !props.image) {
      throw new Error("Image message must have an image");
    }
    if (props.type === "post" && !props.message) {
      throw new Error("Post message must have a message");
    }

    this.id = props.id;
    this.conversationId = props.conversationId;
    this.message = props.message;
    this.image = props.type === "image" ? props.image : undefined;
    this.senderId = props.senderId;
    this.senderUsername = props.senderUsername;
    this.status = props.status;
    this.type = props.type;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? this.createdAt;
  }

  // ---------------- SETTERS ----------------

  updateStatus(status: CompactMessage["status"]) {
    this.status = status;
  }

  updateMessage(message: string) {
    this.message = message;
    this.updatedAt = new Date();
  }

  addSenderUsername(username: string): boolean {
    if (this.senderUsername) return false;
    this.senderUsername = username;
    return true;
  }

  // ---------------- GETTERS ----------------

  getId(): CompactMessage["id"] {
    return this.id;
  }

  getConversationId(): CompactMessage["conversationId"] {
    return this.conversationId;
  }

  getMessage(): CompactMessage["message"] {
    return this.message;
  }

  getImage(): CompactMessage["image"] {
    return this.image;
  }

  getSenderId(): CompactMessage["senderId"] {
    return this.senderId;
  }

  getSenderUsername(): CompactMessage["senderUsername"] {
    return this.senderUsername;
  }

  getStatus(): CompactMessage["status"] {
    return this.status;
  }

  getType(): CompactMessage["type"] {
    return this.type;
  }

  getCreatedAt(): CompactMessage["createdAt"] {
    return this.createdAt;
  }

  getUpdatedAt(): CompactMessage["updatedAt"] {
    return this.updatedAt;
  }

  // --------- Boolean helpers ---------
  isSentBy(userId: string): boolean {
    return this.senderId === userId;
  }

  isText(): boolean {
    return this.type === "text";
  }

  isImage(): boolean {
    return this.type === "image";
  }

  isPost(): boolean {
    return this.type === "post";
  }

  isSeen(): boolean {
    return this.status === "seen";
  }

  isDelivered(): boolean {
    return this.status === "delivered";
  }

  isSent(): boolean {
    return this.status === "sent";
  }

  isUpdated(): boolean {
    return this.updatedAt.getTime() > this.createdAt.getTime();
  }
}

type MessageProps = Omit<CompactMessage, "createdAt" | "updatedAt"> & {
  createdAt?: Date;
  updatedAt?: Date;
};
