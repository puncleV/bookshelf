import {sql} from "../../adapters";
import * as repositories from "../../repositories";
import {IBookSearchRequest, IBookSearchResult} from "./types";

export interface IBookSearcherDependencies {
  bookRepository: repositories.BookRepository;
}

export class BookSearcher {
  private bookRepository: repositories.BookRepository;

  constructor(dependencies: IBookSearcherDependencies) {
    this.bookRepository = dependencies.bookRepository;
  }

  public async find(bookCreateRequest: IBookSearchRequest): Promise<IBookSearchResult> {
    const {order, skip, limit, ...fields} = bookCreateRequest;

    const books = await this.bookRepository.findMany(fields || {}, {
      limit: limit,
      skip: skip,
      ...this.parseOrder(order)
    });

    return books;
  }

  private parseOrder (order: string | undefined): {orderBy: string, order:  sql.SortOrder} | {} {
    if (order == null) {
      return {};
    }

    return {
      order: /^-/.test(order) ? sql.SortOrder.DESC : sql.SortOrder.ASC,
      orderBy: order.replace(/[-+]/, ""),
    };
  }
}
