import {expect} from "chai";
import {sql} from "../../../../src/adapters";

describe("InsertBuilder", () => {
  let insertBuilder: sql.InsertBuilder;

  beforeEach(() => {
    insertBuilder = new sql.InsertBuilder();
  });

  describe("build", () => {
    it("different field types", () => {
      const tableName = "table";
      const columns = ["column1", "c'olumn2"];

      const sql = insertBuilder.build({
        tableName,
        columns,
        fields: {
          field1: 33,
          field2: {a: "\\\'\": \" '"},
          "field'\\": "\\\\ \\\\ \\ \\\\'\": \" '' \\\\ \\\\\\ \\ \\' \\\\' ",
        },
      });

      expect(sql).to.be.eql(
        "INSERT INTO `table` SET `field1` = 33, `field2` = '[object Object]', `field'\\` = '\\\\\\\\ \\\\\\\\ \\\\ \\\\\\\\\\'\\\": \\\" \\'\\' \\\\\\\\ \\\\\\\\\\\\ \\\\ \\\\\\' \\\\\\\\\\' '",
      );
    });
  });
});
