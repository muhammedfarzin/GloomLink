import { type Document, model, Schema } from "mongoose";

export interface Interaction {
  _id: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  postId: Schema.Types.ObjectId;
  type: "view" | "like" | "comment" | "save";
  weight: number;
  createdAt: Date;
}

export type InteractionDocument = Interaction & Document;

const interactionSchema = new Schema<Interaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    postId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Post",
    },
    type: {
      type: String,
      required: true,
      enum: ["view", "like", "comment", "save"],
    },
    weight: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

interactionSchema.index({ userId: 1, createdAt: -1 });
interactionSchema.index({ userId: 1, postId: 1, type: 1 });

export const InteractionModel = model<Interaction>(
  "Interaction",
  interactionSchema,
  "interactions"
);
