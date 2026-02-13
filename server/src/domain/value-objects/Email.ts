import { EMAIL_REGEX } from "../rules/EmailRules";

export class Email {
  constructor(private readonly value: string) {
    if (!EMAIL_REGEX.test(value)) {
      throw new Error("Invalid email address");
    }
  }

  getValue() {
    return this.value;
  }
}
