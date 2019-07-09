import {asClass, createContainer} from "awilix";

import config from "../configs/config.json";

import * as adapters from "./adapters";
import * as controllers from "./controllers";
import * as repositories from "./repositories";
import * as services from "./services";

export const container = createContainer().register({
  BookController: asClass(controllers.BookController),

  bookCreator: asClass(services.BookCreator),
  bookSearcher: asClass(services.BookSearcher),

  bookRepository: asClass(repositories.BookRepository),

  selectBuilder: asClass(adapters.sql.SelectBuilder),
  insertBuilder: asClass(adapters.sql.InsertBuilder),
  updateBuilder: asClass(adapters.sql.UpdateBuilder),
  deleteBuilder: asClass(adapters.sql.DeleteBuilder),
  sqlConnection: asClass(adapters.sql.SqlConnection).inject(() => ({
    config: config.database
  })).singleton(),
});
