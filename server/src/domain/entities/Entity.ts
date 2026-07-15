export class Entity {
  private readonly id: string;

  constructor({ id }: { id: string }) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  isId(id: string): boolean {
    return this.id === id;
  }
}
