import casual from "casual";
import {expect, request} from "chai";

import {server} from "../../../src/api";


describe("BookController", () => {
  describe("get", () => {
    it("get by customerId", async () => {
      const bookToCreate = {
        title: casual.word,
        issueDate: new Date(casual.date()).toISOString(),
        author: casual.first_name,
        description: casual.string,
        image: casual.uuid,
      };

      const response = await request(server)
        .post(`/books`)
        .send(bookToCreate);

      expect(response).to.have.status(200);
      expect(response.body).to.include(bookToCreate);
      expect(response.body).to.have.property("id").that.is.string;
    });
  });
});
