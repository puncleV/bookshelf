import Koa from "koa";

import * as services from "../services";
import {
  BOOK_CREATE_VALIDATOR,
  BOOK_SEARCH_VALIDATOR,
  BOOK_UPDATE_VALIDATOR,
  DEFAULT_RESPONSE_STATUS
} from "./constants";

export interface IBookControllerDependencies {
  bookCreator: services.BookCreator;
  bookUpdater: services.BookUpdater;
  bookSearcher: services.BookSearcher;
}

// todo validation decorator
export class BookController {
  private bookCreator: services.BookCreator;
  private bookUpdater: services.BookUpdater;
  private bookSearcher: services.BookSearcher;

  constructor(dependencies: IBookControllerDependencies) {
    this.bookCreator = dependencies.bookCreator;
    this.bookUpdater = dependencies.bookUpdater;
    this.bookSearcher = dependencies.bookSearcher;
  }

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

  public async update(ctx: Koa.Context) {
    // todo typings for ctx.request
    // @ts-ignore
    const validation = BOOK_UPDATE_VALIDATOR.validate<services.IBookUpdateRequest>(ctx.request.body);

    if (validation.error) {
      ctx.response.body = {
        status: DEFAULT_RESPONSE_STATUS.ERROR
      }
    }

    ctx.response.body = await this.bookUpdater.update({...validation.value, id: ctx.params.id});
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
    // todo add cache
    ctx.response.body = await this.bookSearcher.find(validation.value);
  }
}
