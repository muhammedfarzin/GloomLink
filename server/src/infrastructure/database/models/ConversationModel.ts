import { type Document, model, Schema } from "mongoose";

export interface Conversation {
  _id: Schema.Types.ObjectId;
  participants: Schema.Types.ObjectId[];
}

export type ConversationDocument = Conversation & Document;

const conversationSchema = new Schema<Conversation>({
  participants: {
    type: [Schema.Types.ObjectId],
    validate: {
      validator: function (value: Schema.Types.ObjectId[]) {
        return value.length >= 2;
      },
      message: () => `A conversation must have at least two participants.`,
    },
    required: true,
  },
});

export const ConversationModel = model(
  "Conversation",
  conversationSchema,
  "conversations"
);
