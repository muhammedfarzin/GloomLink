import { Entity } from "../entities/Entity";

export interface IRepository {
  create(data: Entity): Promise<Entity>;
  findById(id: string): Promise<Entity | null>;
  update(data: Entity): Promise<Entity | null>;
  deleteById(id: string): Promise<Entity | null>;
}
