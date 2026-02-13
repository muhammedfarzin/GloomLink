export class UserGender {
  private readonly value: "f" | "m";

  constructor(value: string) {
    if (value !== "f" && value !== "m") {
      throw new Error("Invalid gender");
    }
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}
