import * as repositories from "../../repositories";
import {IBookUpdateRequest, IBookUpdateResult} from "./types";

export interface IBookCreatorDependencies {
  bookRepository: repositories.BookRepository;
}

export class BookUpdater {
  private bookRepository: repositories.BookRepository;

  constructor(dependencies: IBookCreatorDependencies) {
    this.bookRepository = dependencies.bookRepository;
  }

  public async create(bookCreateRequest: IBookUpdateRequest): Promise<IBookUpdateResult> {
    const {id, ...updateFields} = bookCreateRequest;

    return  await this.bookRepository.update(bookCreateRequest.id, updateFields) as IBookUpdateResult;
  }
}
