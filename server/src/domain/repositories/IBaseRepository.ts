import { BaseEntity } from "../entities/BaseEntity";

export interface IBaseRepository<
  T extends BaseEntity = BaseEntity,
  TId = string,
> {
  readonly entityName?: string;

  create(data: T): Promise<T>;
  findById(id: TId): Promise<T | null>;
  update(data: T): Promise<T | null>;
  deleteById(id: TId): Promise<T | null>;

  save?(data: T): Promise<T>;
  findByIds?(ids: TId[]): Promise<T[]>;
  exists?(id: TId): Promise<boolean>;
}

export type IRepository<
  T extends BaseEntity = BaseEntity,
  TId = string,
> = IBaseRepository<T, TId>;
