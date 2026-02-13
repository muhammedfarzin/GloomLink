import { MOBILE_REGEX } from "../rules/MobileRules";

export class MobileNumber {
  constructor(private readonly value: string) {
    if (!MOBILE_REGEX.test(value)) {
      throw new Error("Invalid mobile number");
    }
  }
  getValue() {
    return this.value;
  }
}
