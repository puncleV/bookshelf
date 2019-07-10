import {BaseRepository, IBaseRepositoryDependencies} from "./base-repository";
import {BookFieldsMap} from "./constants";
import {IBook, IRawBook} from "./types";

export class BookRepository extends BaseRepository<IBook, IRawBook> {
  constructor(dependencies: IBaseRepositoryDependencies) {
    super(dependencies, {
      entity: "book",
      mapToRawFields: BookFieldsMap,
    });
  }
}
