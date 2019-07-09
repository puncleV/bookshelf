import casual from "casual";
import {expect, request} from "chai";

import {server} from "../../../src/api";
import {createBookRepository} from "../component-creators";

describe("BookController", () => {
  describe("create", () => {
    it("create by customerId", async () => {
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

  describe("find", () => {
    const createBookStub = () => ({
      title: casual.word,
      issueDate: new Date(casual.date()).toISOString().replace(/T.*/, ""),
      author: casual.first_name,
      description: casual.string,
      image: casual.uuid,
    });

    it("find all books", async () => {
      const bookRepo = createBookRepository();
      const books = [];

      for (let i = 0; i < 5; i++) {
        books.push(createBookStub());
      }

      await Promise.all(books.map((book) => bookRepo.create(book)));

      const response = await request(server).get(`/books`);

      expect(response).to.have.status(200);
      // todo prettify
      expect(
        response.body
          .map((book: any) => ({
            title: book.title,
            issueDate: book.issueDate.replace(/T.*/, ""),
            author: book.author,
            description: book.description,
            image: book.image,
          }))
          .sort((a: any, b: any) => (a.author < b.author ? 1 : -1)),
      ).to.deep.include.members(books.sort((a: any, b: any) => (a.author < b.author ? 1 : -1)));
    });
    it("find all with skip and limit", async () => {
      const bookRepo = createBookRepository();
      const books = [];

      for (let i = 0; i < 5; i++) {
        books.push(createBookStub());
      }

      await Promise.all(books.map((book) => bookRepo.create(book)));

      const response = await request(server).get(`/books?skip=1&limit=1`);

      expect(response).to.have.status(200);
      expect(response.body).to.have.length(1);
      // todo prettify
      const book = response.body.map((book: any) => ({
        title: book.title,
        issueDate: book.issueDate.replace(/T.*/, ""),
        author: book.author,
        description: book.description,
        image: book.image,
      }))[0];
      expect(books.some((createdBook) => createdBook.image === book.image)).to.be.true;
    });
    it("find by field", async () => {
      const bookRepo = createBookRepository();
      const books = [];

      for (let i = 0; i < 5; i++) {
        books.push(createBookStub());
      }

      await Promise.all(books.map((book) => bookRepo.create(book)));

      const response = await request(server).get(`/books?image=${books[0].image}`);

      expect(response).to.have.status(200);
      expect(response.body).to.have.length(1);
      // todo prettify
      const book = response.body.map((book: any) => ({
        title: book.title,
        issueDate: book.issueDate.replace(/T.*/, ""),
        author: book.author,
        description: book.description,
        image: book.image,
      }))[0];
      expect(books[0].image).to.be.eql(book.image);
    });
  });
});
