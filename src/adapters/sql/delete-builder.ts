import {AbstractBuilder} from "./abstract-builder";
import {IQueryParams} from "./types";

// todo maybe add some integration tests
export class DeleteBuilder extends AbstractBuilder {
  public build(params: IQueryParams) {
    let sql = `DELETE ${this.stringifyColumns(params.columns) || '*'} FROM ${this.escapeId(params.tableName)} `;

    if (params.query == null) {
      return sql;
    }

    const {
      where,
      limit,
    } = params.query;

    if (where != null) {
      sql += `${this.where(where)} `
    } else {
      // todo typed error
      throw new Error("`where` is required to DELETE operation");
    }

    if (limit != null) {
      sql += `LIMIT ${this.escapeValue(limit)} `;
    }

    return sql;
  }
}
