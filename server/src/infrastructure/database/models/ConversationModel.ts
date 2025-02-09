import { model, Schema } from "mongoose";

export interface Conversation {
  participants: Schema.Types.ObjectId[];
}

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
