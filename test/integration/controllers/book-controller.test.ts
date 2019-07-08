import casual from "casual";
import {expect, request} from "chai";
import _ from "lodash";

import {server} from "../../../src/api";


describe("HelloController", () => {
  describe("get", () => {
    it("get by customerId", async () => {
      const response = await request(server).get(`/books`);

      expect(response).to.have.status(200);
      expect(response.text).to.eql("Hello world!");
    });
  });
});
