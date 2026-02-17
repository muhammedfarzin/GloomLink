export class UserStatus {
  constructor(private readonly value: UserStatusType) {
    switch (value) {
      case "active":
      case "inactive":
      case "blocked":
      case "not-verified":
        this.value = value;
      default:
        throw new Error("Invalid user status");
    }
  }

  getValue() {
    return this.value;
  }
}

export type UserStatusType = "active" | "inactive" | "blocked" | "not-verified";
