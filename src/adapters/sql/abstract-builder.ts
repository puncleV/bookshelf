import _ from "lodash";
import SqlString from "sqlstring";
import {IBuilder, IQueryParams, IWhere} from "./types";

export abstract class AbstractBuilder implements IBuilder {
  public abstract build(params: IQueryParams): string;

  protected stringifyColumns(columns: IQueryParams["columns"]): string {
    if (columns == null || columns.length === 0) {
      return "";
    }

    return this.escapeId(columns);
  }

  protected where(where?: IWhere) {
    if (where == null || _.isEmpty(where)) {
      return "";
    }

    // todo make more readable
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

        const escapedKey = this.escapeId(key);
        if (Array.isArray(value)) {
          keyValues.push(
            ...value.map((fieldValue) => ({
              key: escapedKey,
              value: this.escapeValue(fieldValue),
            })),
          );
        } else {
          keyValues.push({
            key: escapedKey,
            value: this.escapeValue(value),
          });
        }

        acc += keyValues.map(({key, value}) => `${key} = ${value}`).join(" OR ");

        return acc;
      }, "WHERE ") + " )"
    );
  }

  protected escapeValue(value: string | number | Record<string, any>): string {
    return SqlString.escape(value);
  }

  protected escapeId(value: string | string[]): string {
    return SqlString.escapeId(value);
  }
}
