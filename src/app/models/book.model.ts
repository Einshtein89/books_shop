import {Catalog} from "./catalog.model";

export class Book {
  public id: string;
  public author: string;
  public title: string;
  public price: any;
  public photo: any;
  public catalog: Catalog;

  constructor(book: any) {
    Object.keys(book).forEach((key) => this[key] = book[key]);
  }
}
