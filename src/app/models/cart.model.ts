import {Book} from "./book.model";

export class Cart {
  public books: Array<Book>;

  constructor(cart: any) {
    Object.keys(cart).forEach((key) => this[key] = cart[key]);
  }
}
