import { Message } from "../entities/Message";

export interface IMarkMessageAsSeen {
  execute(input: MarkMessageAsSeenInput): Promise<Message>;
}

export interface MarkMessageAsSeenInput {
  messageId: string;
  viewerId: string;
}
