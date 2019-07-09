import joi from "joi";

export enum DEFAULT_RESPONSE_STATUS {
  SUCCESS = "success",
  ERROR = "error",
}

export const BOOK_CREATE_VALIDATOR = joi.object({
  title: joi.string(),
  issueDate: joi.date().iso(),
  author: joi.string(),
  description: joi.string(),
  image: joi.string().uuid(),
});

export const BOOK_UPDATE_VALIDATOR = joi.object({
  title: joi.string(),
  issueDate: joi.date().iso(),
  author: joi.string(),
  description: joi.string(),
  image: joi.string().uuid(),
});


export const BOOK_SEARCH_VALIDATOR = joi.object({
  fields: BOOK_CREATE_VALIDATOR,
  order: joi.string(),
  skip: joi.number(),
  limit: joi.number(),
});
