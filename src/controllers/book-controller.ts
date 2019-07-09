import Koa from "koa";

import * as services from "../services";
import {BOOK_CREATE_VALIDATOR, DEFAULT_RESPONSE_STATUS} from "./constants";

export interface IBookControllerDependencies {
  bookCreator: services.BookCreator;
}

export class BookController {
  private bookCreator: services.BookCreator;
  constructor(dependencies: IBookControllerDependencies) {
    this.bookCreator = dependencies.bookCreator;
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
}
