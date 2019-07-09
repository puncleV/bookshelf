import {IQueryParams, SortOrder} from "./types";
import {AbstractBuilder} from "./abstract-builder";

// todo maybe add some integration tests
export class SelectBuilder extends AbstractBuilder {
  public build(params: IQueryParams) {
    let sql = `SELECT ${this.getColumns(params.columns) || '*'} FROM ${this.escapeId(params.tableName)} `;

    if (params.query == null) {
      return sql;
    }

    const {
      where,
      limit,
      skip,
      orderBy,
      order
    } = params.query;

    if (where != null) {
      sql += `${this.where(where)} `
    }

    if (orderBy != null) {
      const sortOrder = order || SortOrder.ASC;

      if (!Object.values(SortOrder).includes(sortOrder)) {
        // todo typed error
        throw new Error(`unexpected order ${sortOrder}`)
      }

      sql += `ORDER BY ${this.escapeId(orderBy)} ${sortOrder} `;
    }

    if (limit != null) {
      sql += `LIMIT ${this.escapeValue(limit)} `;
    }

    if (skip != null) {
      sql += `OFFSET ${this.escapeValue(skip )} `;

    }

    return sql;
  }
}
