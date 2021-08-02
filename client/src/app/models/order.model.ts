import {Book} from "./book.model";

export class Order {
  public amount: number;
  public book: Book;
  public bookId: number;
  public date: Date;
  public id: number;
  public uniqueId: number;
  public userId: number;
  public totalAmount: number;

  constructor(order: any) {
    Object.keys(order).forEach((key) => this[key] = order[key]);
  }
}
