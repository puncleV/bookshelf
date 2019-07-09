import {createSqlConnection} from "./integration/component-creators";

export const cleanUpDatabase = async () => {
  const sqlConnection = createSqlConnection();
  await sqlConnection.connection("book").delete();
};
