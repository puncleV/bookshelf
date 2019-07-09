import * as repositories from "../../repositories";
import {IBookCreate, IBookCreateResult} from "./types";

export interface IBookCreatorDependencies {
  bookRepository: repositories.BookRepository;
}

export class BookCreator {
  private bookRepository: repositories.BookRepository;

  constructor(dependencies: IBookCreatorDependencies) {
    this.bookRepository = dependencies.bookRepository;
  }

  public async create(bookCreateRequest: IBookCreate): Promise<IBookCreateResult> {
    const book = await this.bookRepository.create(bookCreateRequest);

    return book;
  }
}
