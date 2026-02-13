import { Interaction } from "../entities/Interaction";

export interface IRecordInteraction {
  execute(input: RecordInteractionInput): Promise<Interaction>;
}

export interface RecordInteractionInput {
  userId: string;
  postId: string;
  type: "view" | "like" | "comment" | "save";
}
