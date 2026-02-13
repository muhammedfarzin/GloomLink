export class PasswordHash {
  constructor(private readonly value: string) {
    if (!value.startsWith("$")) {
      throw new Error("Password must be hashed");
    }
  }

  getValue() {
    return this.value;
  }
}
