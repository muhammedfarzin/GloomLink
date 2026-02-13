import { InvalidUrlError } from "../errors/InvalidUrlError";

export class Url {
  private readonly value: string;

  constructor(value: string) {
    try {
      new URL(value);
    } catch {
      throw new InvalidUrlError();
    }
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}
