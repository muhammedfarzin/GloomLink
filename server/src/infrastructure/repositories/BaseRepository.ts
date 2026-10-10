import { Model, Document, UpdateQuery } from "mongoose";
import { injectable } from "inversify";
import type { IBaseRepository } from "@/domain/repositories/IBaseRepository";
import { BaseEntity } from "@/domain/entities/BaseEntity";

export interface IMapper<T extends BaseEntity, TDoc> {
  toDomain(doc: TDoc): T;
  toPersistence(entity: T): object;
}

@injectable()
export abstract class BaseRepository<
  T extends BaseEntity,
  TDoc extends Document = Document,
  TId = string,
> implements IBaseRepository<T, TId> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract readonly model: Model<any>;
  protected abstract readonly mapper: IMapper<T, TDoc>;

  async create(data: T): Promise<T> {
    const raw = this.mapper.toPersistence(data) as Record<string, unknown>;

    const { id, ...withoutId } = raw as Record<string, unknown> & {
      id?: unknown;
    };
    const doc = new this.model(withoutId);
    const saved = await doc.save();
    return this.mapper.toDomain(saved as TDoc);
  }

  async findById(id: TId): Promise<T | null> {
    const doc = await this.model.findById(id as string);
    return doc ? this.mapper.toDomain(doc as TDoc) : null;
  }

  async findByIds(ids: TId[]): Promise<T[]> {
    const docs = await this.model.find({
      _id: { $in: ids as string[] },
    });
    return docs.map((doc) => this.mapper.toDomain(doc as TDoc));
  }

  async save(data: T): Promise<T> {
    const raw = this.mapper.toPersistence(data) as Record<string, unknown>;
    const { id, ...fields } = raw as Record<string, unknown> & { id?: unknown };

    if (id) {
      const updated = await this.model.findByIdAndUpdate(
        id as string,
        fields as UpdateQuery<TDoc>,
        {
          new: true,
          upsert: true,
        },
      );
      return this.mapper.toDomain(updated as TDoc);
    }

    return this.create(data);
  }

  async update(data: T): Promise<T | null> {
    const raw = this.mapper.toPersistence(data) as Record<string, unknown>;
    const { id, ...fields } = raw as Record<string, unknown> & { id?: unknown };
    const updated = await this.model.findByIdAndUpdate(
      id as string,
      fields as UpdateQuery<TDoc>,
      { new: true },
    );
    return updated ? this.mapper.toDomain(updated as TDoc) : null;
  }

  async exists(id: TId): Promise<boolean> {
    const count = await this.model.countDocuments({ _id: id as string });
    return count > 0;
  }

  async deleteById(id: TId): Promise<T | null> {
    const deleted = await this.model.findByIdAndDelete(id as string);
    return deleted ? this.mapper.toDomain(deleted as TDoc) : null;
  }
}
