import type { UserStatusType } from "../models/User";

export class UserStatus {
  constructor(private readonly value: UserStatusType) {
    switch (value) {
      case "active":
      case "blocked":
      case "not-verified":
      case "deleted":
        this.value = value;
        break;
      default:
        throw new Error("Invalid user status");
    }
  }

  getValue() {
    return this.value;
  }
}
