import _ from "lodash";
import {IBuilder, IQueryParams, IWhere} from "./types";

export abstract class AbstractBuilder implements IBuilder {
  public abstract build(params: IQueryParams): string;
  protected getColumns(columns: IQueryParams["columns"]): string {
    if (columns == null || columns.length === 0) {
      return "";
    }

    return columns.map((column) => `\`${column}\``).join(", ");
  }

  protected where(where?: IWhere) {
    if (where == null) {
      return "";
    }

    return (
      Object.entries(where).reduce((acc, [key, value]) => {
        if (acc !== " ") {
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
              key: this.screenValues(key),
              value: this.screenValues(fieldValue),
            })),
          );
        } else {
          keyValues.push({
            key: this.screenValues(key),
            value: this.screenValues(value),
          });
        }

        acc += keyValues.map(({key, value}) => `'${key}' = '${value}'`).join(" OR ");

        return acc;
      }, " ") + " )"
    );
  }

  protected screenValues(value: string): string {
    return value.replace("'", "\\'");
  }
}
