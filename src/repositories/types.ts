import * as types from "../types";

export interface IBook {
  id: types.UUID;
  title: string;
  issueDate: string;
  author: string;
  description: string;
  image: string;
}

export interface IRawBook {
  id: types.UUID;
  title: string;
  issue_date: string;
  author: string;
  description: string;
  image: string;
}
