import type { ConversationType } from "../models/Conversation";
import { BaseEntity } from "./BaseEntity";

export class Conversation extends BaseEntity {
  private readonly participants: Set<string>;

  constructor(props: ConversationType) {
    super(props);
    this.participants = new Set(props.participants);
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
