import {expect} from "chai";
import {sql} from "../../../../src/adapters";
import {SortOrder} from "../../../../src/adapters/sql";

describe("SelectBuilder", () => {
  let selectBuilder: sql.SelectBuilder;

  beforeEach(() => {
    selectBuilder = new sql.SelectBuilder();
  });

  describe("build", () => {
    it("full select", () => {
      const tableName = "table";
      const columns = ["column1", "c'olumn2"];
      const where = {
        [columns[0]]: ["WHERE' SELECT"],
        [columns[1]]: "' some serious injection /  '",
      };

      const sql = selectBuilder.build({
        tableName,
        columns,
        query: {
          where,
          limit: 5,
          skip: 5,
          order: SortOrder.ASC,
          orderBy: "column\\",
        },
      });

      expect(sql).to.be.eql(
        "SELECT `column1`, `c'olumn2` FROM `table` WHERE (`column1` = 'WHERE\\' SELECT') AND (`c'olumn2` = '\\' some serious injection /  \\'' ) ORDER BY `column\\` ASC LIMIT 5 OFFSET 5 ",
      );
    });

    it("without 'limit'", () => {
      const tableName = "table";
      const columns = ["column1", "c'olumn2"];
      const where = {
        [columns[0]]: ["WHERE' SELECT"],
        [columns[1]]: "' some serious injection /  '",
      };

      const sql = selectBuilder.build({
        tableName,
        columns,
        query: {
          where,
          skip: 5,
          order: SortOrder.ASC,
          orderBy: "column\\",
        },
      });

      expect(sql).to.be.eql(
        "SELECT `column1`, `c'olumn2` FROM `table` WHERE (`column1` = 'WHERE\\' SELECT') AND (`c'olumn2` = '\\' some serious injection /  \\'' ) ORDER BY `column\\` ASC OFFSET 5 ",
      );
    });

    it("without 'order'", () => {
      const tableName = "table";
      const columns = ["column1", "c'olumn2"];
      const where = {
        [columns[0]]: ["WHERE' SELECT"],
        [columns[1]]: "' some serious injection /  '",
      };

      const sql = selectBuilder.build({
        tableName,
        columns,
        query: {
          where,
          skip: 5,
          limit: 5,
          orderBy: "column\\",
        },
      });

      expect(sql).to.be.eql(
        "SELECT `column1`, `c'olumn2` FROM `table` WHERE (`column1` = 'WHERE\\' SELECT') AND (`c'olumn2` = '\\' some serious injection /  \\'' ) ORDER BY `column\\` ASC LIMIT 5 OFFSET 5 ",
      );
    });

    it("without 'skip'", () => {
      const tableName = "table";
      const columns = ["column1", "c'olumn2"];
      const where = {
        [columns[0]]: ["WHERE' SELECT"],
        [columns[1]]: "' some serious injection /  '",
      };

      const sql = selectBuilder.build({
        tableName,
        columns,
        query: {
          where,
          limit: 5,
          order: SortOrder.ASC,
          orderBy: "column\\",
        },
      });

      expect(sql).to.be.eql(
        "SELECT `column1`, `c'olumn2` FROM `table` WHERE (`column1` = 'WHERE\\' SELECT') AND (`c'olumn2` = '\\' some serious injection /  \\'' ) ORDER BY `column\\` ASC LIMIT 5 ",
      );
    });

    it("without any query", () => {
      const tableName = "table";
      const columns = ["column1", "c'olumn2"];

      const sql = selectBuilder.build({
        tableName,
        columns,
      });

      expect(sql).to.be.eql("SELECT `column1`, `c'olumn2` FROM `table` ");
    });

    it("without specify columns", () => {
      const tableName = "table";

      const sql = selectBuilder.build({
        tableName,
      });

      expect(sql).to.be.eql("SELECT * FROM `table` ");
    });
  });
});
