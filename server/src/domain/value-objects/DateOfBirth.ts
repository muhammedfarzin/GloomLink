import { MAX_HUMAN_LIFESPAN_YEARS } from "../rules/DobRules";

export class DateOfBirth {
  constructor(private readonly value: Date) {
    const now = new Date();

    if (value > now) {
      throw new Error("Date of birth cannot be in the future");
    }

    const maxAgeDate = new Date();
    maxAgeDate.setFullYear(maxAgeDate.getFullYear() - MAX_HUMAN_LIFESPAN_YEARS);

    if (value < maxAgeDate) {
      throw new Error(`Age cannot exceed ${MAX_HUMAN_LIFESPAN_YEARS} years`);
    }

    this.value = value;
  }

  getValue(): Date {
    return this.value;
  }
}
