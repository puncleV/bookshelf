import {database} from "../../configs/config.json";
import {sql} from "../../src/adapters";
import {logger} from "../../src/logger";
import * as repositories from "../../src/repositories";

export const createSqlConnection = (overrides: Partial<sql.ISqlBuilderDependencies> = {}) => {
  return new sql.SqlConnection({
    logger: overrides.logger || logger.child(true),
    config: overrides.config || database,
  });
};

export const createBookRepository = (overrides: Partial<repositories.IBaseRepositoryDependencies> = {}) => {
  return new repositories.BookRepository({
    deleteBuilder: new sql.DeleteBuilder(),
    updateBuilder: new sql.UpdateBuilder(),
    insertBuilder: new sql.InsertBuilder(),
    selectBuilder: new sql.SelectBuilder(),
    sqlConnection: createSqlConnection(),
    ...overrides,
  })
}
