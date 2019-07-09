import {ISqlOperation, IWhere} from "./types";

export class SqlBuilder {
  private operation!: ISqlOperation;
  private columns?: string[];
  private fields?: Record<string, any>;
  private tableName!: string;
  private _where: IWhere = {};

  constructor() {}

  public table(tableName: string) {
    this.tableName = tableName;
    return this;
  }

  public where(fields: IWhere) {
    this._where = fields;
    return this;
  }

  public select(columns?: Array<string>) {
    this.columns = columns;
    this.operation = ISqlOperation.SELECT;
    return this;
  }

  public insert(fields: Record<string, any>) {
    this.operation = ISqlOperation.INSERT;
    return this;
  }

  public update(fields: Record<string, any>) {
    this.operation = ISqlOperation.UPDATE;
    return this;
  }

  public delete() {
    this.operation = ISqlOperation.DELETE;
    return this;
  }

  public build(): string {
    return `${this.operation} ${this.getColumns()} `;
  }


}
