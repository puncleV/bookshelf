import {
  IBook,
  IRawBook,
} from "./types";

export const PizzaFieldsMap = new Map<keyof IBook, keyof IRawBook>([
  ["id", "id"],
  ["title", "title"],
  ["issueDate", "issue_date"],
  ["author", "author"],
  ["description", "description"],
  ["image", "image"],
]);

