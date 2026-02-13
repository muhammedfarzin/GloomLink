import { USERNAME_REGEX } from "../rules/UsernameRules";

export class Username {
  constructor(private readonly value: string) {
    if (!USERNAME_REGEX.test(value)) {
      throw new Error("Invalid username");
    }
  }
  getValue() {
    return this.value;
  }
}
