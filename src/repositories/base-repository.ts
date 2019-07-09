import uuid from "uuid";
import _ from "lodash";

import {sql} from "../adapters";
import * as types from "../types";

export interface IBaseRepositoryDependencies {
  sqlConnection: sql.SqlConnection;
  selectBuilder: sql.SelectBuilder;
  insertBuilder: sql.InsertBuilder;
  updateBuilder: sql.UpdateBuilder;
  deleteBuilder: sql.DeleteBuilder;
}

// T - internal type, Q - type as it is in database
export interface IBaseRepositoryParams<T, Q> {
  entity: string;
  mapToRawFields: Map<keyof T, keyof Q>;
}

export class BaseRepository<T extends {id: string}, Q> {
  protected sqlConnection: sql.SqlConnection;
  protected entity: string;
  protected mapToRawFields: Map<keyof T, keyof Q>;
  protected mapToInternalFields: Map<keyof Q, keyof T>;
  protected selectBuilder: sql.SelectBuilder;
  protected insertBuilder: sql.InsertBuilder;
  protected updateBuilder: sql.UpdateBuilder;
  protected deleteBuilder: sql.DeleteBuilder;

  constructor(dependencies: IBaseRepositoryDependencies, params: IBaseRepositoryParams<T, Q>) {
    this.sqlConnection = dependencies.sqlConnection;
    this.selectBuilder = dependencies.selectBuilder;
    this.insertBuilder = dependencies.insertBuilder;
    this.updateBuilder = dependencies.updateBuilder;
    this.deleteBuilder = dependencies.deleteBuilder;

    this.entity = params.entity;
    this.mapToRawFields = params.mapToRawFields;
    this.mapToInternalFields = Array.from(params.mapToRawFields.entries()).reduce(
      (acc, [key, value]) => {
        acc.set(value, key as keyof T);
        return acc;
      },
      new Map() as Map<keyof Q, keyof T>,
    );
  }

  public async create(entity: types.Omit<T, "id">): Promise<T> {
    const id = uuid.v4();

    await this.sqlConnection.connection.raw(
      this.insertBuilder.build({
        fields: this.getRawEntityFromInternal({...entity, id} as T),
        tableName: this.entity,
      }),
    );

    return (await this.findById(id)) as T;
  }

  public async find(entity: Partial<T>): Promise<T | null> {
    const rawData = await this.sqlConnection.connection.raw(
      this.selectBuilder.build({
        tableName: this.entity,
        query: {
          where: this.getRawEntityFromInternal(entity),
          limit: 1,
        },
      }),
    );

    return this.getInternalEntityFromRaw(_.get(rawData, "[0][0]", null) as Q) as T;
  }

  public async findMany(entity: Partial<T>, query: types.Omit<sql.IQuery, "where">): Promise<T[]> {
    const rawData = await this.sqlConnection.connection.raw(
      this.selectBuilder.build({
        tableName: this.entity,
        query: {
          ...query,
          where: this.getRawEntityFromInternal(entity),
        },
      }),
    );

    return _.get(rawData, "[0]", []).map((rawRow: Q) => this.getInternalEntityFromRaw(rawRow));
  }

  public async update(id: string, entity: Partial<types.Omit<T, "id">>) {
    await this.sqlConnection
      .connection.raw(this.updateBuilder.build({
        tableName: this.entity,
        fields: this.getRawEntityFromInternal(entity as T),
        query: {
          where: {id}
        }
      }));

    return this.findById(id);
  }

  public async findById(id: string): Promise<T | null> {
    return this.find({id} as Partial<T>);
  }

  public async deleteById(id: string): Promise<void> {
    return this.delete({id} as T);
  }

  public async delete(entity: Partial<T>): Promise<void> {
    return this.sqlConnection
      .connection.raw(this.deleteBuilder.build({
        tableName: this.entity,
        query: {
          where: this.getRawEntityFromInternal(entity)
        }
      }))
  }

  // todo this is not the best place for this generic method
  protected changeKeysByMap<X, Y>(entity: Partial<X>, map: Map<keyof X, keyof Y>): Partial<Y> {
    return Object.entries(entity).reduce(
      (acc, [key, value]) => {
        const rawFieldName = map.get(key as keyof X) as keyof Y;

        if (rawFieldName == null) {
          throw new Error(`mapping for ${this.entity} ${key} was not find`);
        }

        acc[rawFieldName] = value;

        return acc;
      },
      {} as Record<keyof Y, any>,
    );
  }

  protected getInternalEntityFromRaw(entity: Partial<Q> | Q): Partial<T> | T | null {
    if (entity == null) {
      return null;
    }

    return this.changeKeysByMap(entity, this.mapToInternalFields);
  }

  protected getRawEntityFromInternal(entity: Partial<T> | T): Partial<Q> | Q {
    return this.changeKeysByMap(entity, this.mapToRawFields);
  }
}
