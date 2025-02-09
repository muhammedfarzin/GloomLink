import { model, Schema } from "mongoose";

export interface Message {
  conversation: Schema.Types.ObjectId;
  message: string;
  image: string;
  from: Schema.Types.ObjectId;
  status: "sent" | "delivered" | "seen";
  type: "text" | "image";
}

const messageSchema = new Schema<Message>(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    message: String,
    image: String,
    from: {
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
    },
  },
  { timestamps: true }
);

export const MessageModel = model("Message", messageSchema, "messages");
