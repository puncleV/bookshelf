export interface ISqlConfig {
  client: string;
  host: string;
  user: string;
  password: string;
  database: string;
  timezone: string;
  connectionLimit: number;
}

export enum ISqlOperation {
  DELETE = "delete",
  SELECT = "select",
  INSERT = "insert",
  UPDATE = "update"
}
export type IWhere = Record<string, any | any[]>

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface IQuery {
  where?: IWhere;
  limit?: number;
  skip?: number;
  orderBy?: string;
  order?: SortOrder;
}

export interface IQueryParams {
   columns?: string[];
   fields?: Record<string, any>;
   tableName: string;
   query?: IQuery;
}

export interface IBuilder {
  build(params: IQueryParams): string;
}
