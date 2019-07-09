import {expect} from "chai";
import {sql} from "../../../../src/adapters";

describe("UpdateBuilder", () => {
  let selectBuilder: sql.UpdateBuilder;

  beforeEach(() => {
    selectBuilder = new sql.UpdateBuilder();
  });

  describe("build", () => {
    it("with where", () => {
      const tableName = "table";
      const where = {
        ["@|\\ \ \\\ '"]: ["WHERE' DELETE"],
        ["column"]: ["' some serious injection /  '", "lol"],
      };

      const sql = selectBuilder.build({
        tableName,
        fields: {
          field1: 33,
          field2: {a: "\\\'\": \" '"},
          "field'\\": "\\\\ \\\\ \\ \\\\'\": \" '' \\\\ \\\\\\ \\ \\' \\\\' ",
        },
        query: {
          where,
        },
      });

      expect(sql).to.be.eql(
        "UPDATE `table` SET `field1` = 33, `field2` = '[object Object]', `field'\\` = '\\\\\\\\ \\\\\\\\ \\\\ \\\\\\\\\\'\\\": \\\" \\'\\' \\\\\\\\ \\\\\\\\\\\\ \\\\ \\\\\\' \\\\\\\\\\' ' WHERE (`@|\\  \\ '` = 'WHERE\\' DELETE') AND (`column` = '\\' some serious injection /  \\'' OR `column` = 'lol' ) ",
      );
    });

    it("witoput where", () => {
      const tableName = "table";

      const sql = selectBuilder.build({
        tableName,
        fields: {
          field1: 33,
          field2: {a: "\\\'\": \" '"},
          "field'\\": "\\\\ \\\\ \\ \\\\'\": \" '' \\\\ \\\\\\ \\ \\' \\\\' ",
        },
        query: {
        },
      });

      expect(sql).to.be.eql(
        "UPDATE `table` SET `field1` = 33, `field2` = '[object Object]', `field'\\` = '\\\\\\\\ \\\\\\\\ \\\\ \\\\\\\\\\'\\\": \\\" \\'\\' \\\\\\\\ \\\\\\\\\\\\ \\\\ \\\\\\' \\\\\\\\\\' ' ",
      );
    });

    it("witoput query", () => {
      const tableName = "table";

      const sql = selectBuilder.build({
        tableName,
        fields: {
          field1: 33,
          field2: {a: "\\\'\": \" '"},
          "field'\\": "\\\\ \\\\ \\ \\\\'\": \" '' \\\\ \\\\\\ \\ \\' \\\\' ",
        },
      });

      expect(sql).to.be.eql(
        "UPDATE `table` SET `field1` = 33, `field2` = '[object Object]', `field'\\` = '\\\\\\\\ \\\\\\\\ \\\\ \\\\\\\\\\'\\\": \\\" \\'\\' \\\\\\\\ \\\\\\\\\\\\ \\\\ \\\\\\' \\\\\\\\\\' ' ",
      );
    });
  });
});
