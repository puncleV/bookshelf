import {AbstractBuilder} from "./abstract-builder";
import {IQueryParams} from "./types";

// todo maybe add some integration tests
export class InsertBuilder extends AbstractBuilder {
  public build(params: IQueryParams) {
    if (params.fields == null) {
      throw new Error("Cant insert empty data");
    }

    return `INSERT INTO ${this.escapeId(params.tableName)} SET ${this.escapeValue(params.fields)}`;
  }
}
