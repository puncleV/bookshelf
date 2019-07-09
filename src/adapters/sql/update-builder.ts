import {AbstractBuilder} from "./abstract-builder";
import {IQueryParams} from "./types";

// todo maybe add some integration tests
export class UpdateBuilder extends AbstractBuilder {
  public build(params: IQueryParams) {
    if (params.fields == null) {
      throw new Error("Cant update with nothing");
    }

    let sql = `UPDATE ${this.escapeId(params.tableName)} SET ${this.escapeValue(params.fields)} `;

    if (params.query == null) {
      return sql;
    }

    const {
      where,
    } = params.query;

    if (where != null) {
      sql += `${this.where(where)} `
    }

    return sql;
  }
}
