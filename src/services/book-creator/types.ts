import * as repositories from "../../repositories";
import * as types from "../../types";

export type IBookCreate = types.Omit<repositories.IBook, "id">;
export type IBookCreateResult = repositories.IBook;
