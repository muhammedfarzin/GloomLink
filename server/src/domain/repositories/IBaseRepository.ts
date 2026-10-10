import { BaseEntity } from "../entities/BaseEntity";

export interface IBaseRepository<
  T extends BaseEntity = BaseEntity,
  TId = string,
> {
  create(data: T): Promise<T>;
  findById(id: TId): Promise<T | null>;
  findByIds(ids: TId[]): Promise<T[]>;
  save(data: T): Promise<T>;
  update(data: T): Promise<T | null>;
  exists(id: TId): Promise<boolean>;
  deleteById(id: TId): Promise<T | null>;
}
