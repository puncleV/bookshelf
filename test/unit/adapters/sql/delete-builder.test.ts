import {expect} from "chai";
import {sql} from "../../../../src/adapters";

describe.only("DeleteBuilder", () => {
  let selectBuilder: sql.DeleteBuilder;

  beforeEach(() => {
    selectBuilder = new sql.DeleteBuilder();
  });

  describe("build", () => {
    it("without limit field", () => {
      const tableName = "table";
      const where = {
        ["@|\\ \ \\\ '"]: ["WHERE' DELETE"],
        ["column"]: ["' some serious injection /  '", "lol"],
      };

      const sql = selectBuilder.build({
        tableName,
        query: {
          where,
        },
      });

      expect(sql).to.be.eql(
        "DELETE * FROM `table` WHERE (`@|\\  \\ '` = 'WHERE\\' DELETE') AND (`column` = '\\' some serious injection /  \\'' OR `column` = 'lol' ) ",
      );
    });

    it("with limit field", () => {
      const tableName = "table";
      const where = {
        ["@|\\ \ \\\ '"]: ["WHERE' DELETE"],
        ["column"]: "' some serious injection /  '",
      };

      const sql = selectBuilder.build({
        tableName,
        query: {
          where,
          limit: 5,
        },
      });

      expect(sql).to.be.eql(
        "DELETE * FROM `table` WHERE (`@|\\  \\ '` = 'WHERE\\' DELETE') AND (`column` = '\\' some serious injection /  \\'' ) LIMIT 5 ",
      );
    });
  });
});
