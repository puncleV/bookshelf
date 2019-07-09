import {IQueryParams} from "./types";
import {AbstractBuilder} from "./abstract-builder";

export class SelectBuilder extends AbstractBuilder {
  public build(params: IQueryParams) {
    return `SELECT ${this.getColumns(params.columns) || '*'} FROM '${params.tableName} ${this.where()}'`;
  }
}
