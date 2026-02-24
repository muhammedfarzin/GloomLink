import { type Document, model, Schema } from "mongoose";

export interface Message {
  _id: Schema.Types.ObjectId;
  conversationId: Schema.Types.ObjectId;
  message: string;
  image: string;
  senderId: Schema.Types.ObjectId;
  status: "sent" | "delivered" | "seen";
  type: "text" | "image" | "post";
  createdAt: Date;
  updatedAt: Date;
}

export type MessageDocument = Message & Document;

const messageSchema = new Schema<Message>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    message: String,
    image: String,
    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      default: "sent",
      enum: ["sent", "delivered", "seen"],
    },
    type: {
      type: String,
      required: true,
      enum: ["text", "image", "post"],
    },
  },
  { timestamps: true },
);

export const MessageModel = model("Message", messageSchema, "messages");
