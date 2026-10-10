import { BaseEntity } from "@/domain/entities/BaseEntity";

export abstract class Mapper<T extends BaseEntity, TDoc> {
  abstract toDomain(doc: TDoc): T;
  abstract toPersistence(entity: T): object;
}
