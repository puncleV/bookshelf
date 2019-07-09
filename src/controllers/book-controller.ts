import Koa from "koa";

import * as services from "../services";
import {BOOK_CREATE_VALIDATOR, BOOK_SEARCH_VALIDATOR, DEFAULT_RESPONSE_STATUS} from "./constants";

export interface IBookControllerDependencies {
  bookCreator: services.BookCreator;
  bookSearcher: services.BookSearcher;
}

export class BookController {
  private bookCreator: services.BookCreator;
  private bookSearcher: services.BookSearcher;

  constructor(dependencies: IBookControllerDependencies) {
    this.bookCreator = dependencies.bookCreator;
    this.bookSearcher = dependencies.bookSearcher;
  }

  // todo validation decorator
  public async create(ctx: Koa.Context) {
    // todo typings for ctx.request
    // @ts-ignore
    const validation = BOOK_CREATE_VALIDATOR.validate<services.IBookCreate>(ctx.request.body);

    if (validation.error) {
      ctx.response.body = {
        status: DEFAULT_RESPONSE_STATUS.ERROR
      }
    }

    ctx.response.body = await this.bookCreator.create(validation.value);
  }

  public async find(ctx: Koa.Context) {
    // todo typings for ctx.request
    // @ts-ignore
    const {query} = ctx.request;
    const validation = BOOK_SEARCH_VALIDATOR.validate<services.IBookSearchRequest>(query);

    if (validation.error) {
      ctx.response.body = {
        status: DEFAULT_RESPONSE_STATUS.ERROR
      }
    }

    ctx.response.body = await this.bookSearcher.find(validation.value);
  }
}
