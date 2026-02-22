import type { ConversationType } from "../models/Conversation";

export class Conversation {
  private readonly conversationId: string;
  private readonly participants: Set<string>;

  constructor(props: ConversationType) {
    this.conversationId = props.conversationId;
    this.participants = new Set(props.participants);
  }

  // ---------------- GETTERS ----------------

  getConversationId(): ConversationType["conversationId"] {
    return this.conversationId;
  }

  // ----------- COLLECTION GETTERS ----------

  getParticipants(): ConversationType["participants"] {
    return Array.from(this.participants);
  }

  // ------------ BOOLEAN HELPERS ------------
  isParticipant(userId: string): boolean {
    return this.participants.has(userId);
  }

  isGroup(): boolean {
    return this.participants.size > 2;
  }

  isPrivate(): boolean {
    return this.participants.size === 2;
  }
}
