import SqlString from "sqlstring";
import {IBuilder, IQueryParams, IWhere} from "./types";

export abstract class AbstractBuilder implements IBuilder {
  public abstract build(params: IQueryParams): string;

  protected getColumns(columns: IQueryParams["columns"]): string {
    if (columns == null || columns.length === 0) {
      return "";
    }

    return columns.map((column) => this.escapeId(column)).join(", ");
  }

  protected where(where?: IWhere) {
    if (where == null) {
      return "";
    }

    return (
      Object.entries(where).reduce((acc, [key, value]) => {
        if (acc !== "WHERE ") {
          acc += ") AND (";
        } else {
          acc += "(";
        }

        let keyValues: Array<{
          key: string;
          value: any;
        }> = [];

        if (Array.isArray(value)) {
          keyValues.push(
            ...value.map((fieldValue) => ({
              key: this.escapeId(key),
              value: this.escapeValue(fieldValue),
            })),
          );
        } else {
          keyValues.push({
            key: this.escapeId(key),
            value: this.escapeValue(value),
          });
        }

        acc += keyValues.map(({key, value}) => `${key} = ${value}`).join(" OR ");

        return acc;
      }, "WHERE ") + " )"
    );
  }

  protected escapeValue (value: string | number): string {
    return SqlString.escape(value);
  }

  protected escapeId (value: string): string {
    return SqlString.escapeId(value);
  }
}
