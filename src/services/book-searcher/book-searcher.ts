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
    const books = await this.bookRepository.findMany(bookCreateRequest.fields || {}, {
      limit: bookCreateRequest.limit,
      skip: bookCreateRequest.skip,
      ...this.parseOrder(bookCreateRequest.order)
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
