import * as repositories from "../../repositories";
import {IBookUpdateRequest, IBookUpdateResult} from "./types";

export interface IBookUpdaterDependencies {
  bookRepository: repositories.BookRepository;
}

export class BookUpdater {
  private bookRepository: repositories.BookRepository;

  constructor(dependencies: IBookUpdaterDependencies) {
    this.bookRepository = dependencies.bookRepository;
  }

  public async update(bookCreateRequest: IBookUpdateRequest): Promise<IBookUpdateResult> {
    const {id, ...updateFields} = bookCreateRequest;

    return  await this.bookRepository.update(bookCreateRequest.id, updateFields) as IBookUpdateResult;
  }
}
