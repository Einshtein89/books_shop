import {Injectable, ViewContainerRef} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Cart} from "../../models/cart.model";
import {ComponentFactory} from "../../component-factory/component-factory";
import {Book} from "../../models/book.model";
import * as  _ from "underscore"


@Injectable()
export class CartService {
  private cartContent = new BehaviorSubject<Cart>(new Cart({books: []}));
  public cartContentAsObservable = this.cartContent.asObservable();
  public booksInCart = new BehaviorSubject<Map<Book, number>>(new Map<Book, number>());
  public booksInCartAsObservable = this.booksInCart.asObservable();
  public allBooksInCart: Array<Book> = [];
  public shouldDisplayEmptyCartPopup = new BehaviorSubject<boolean>(false);
  public shouldDisplayEmptyCartPopupAsObservable = this.shouldDisplayEmptyCartPopup.asObservable();

  constructor(private componentFactory: ComponentFactory) {
  }

  public setCartContent(cart: Cart) {
    this.cartContent.next(cart);
  }

  public addBookToCart(book: Book) {
    let booksMap = this.booksInCart.getValue();
    if (!booksMap.has(book)) {
      booksMap.set(book, 1);
    } else {
      booksMap.set(book, booksMap.get(book) + 1);
    }
    this.booksInCart.next(booksMap);
  }

  public showAddToCartPopup(entity: Book, component: any, popup: ViewContainerRef, options: any) {
    const expComponent =  this.componentFactory.getComponent(component, popup);
    expComponent.instance._ref = expComponent;
    expComponent.instance.options = options;
    expComponent.instance._currentBook = entity;
  }

  public changeBookQuantity(book: Book, options: any) {
    let booksMap = this.booksInCart.getValue();
    if (options.removeSingle) {
      if (booksMap.get(book) == 1) {
        booksMap.delete(book);
      } else {
        booksMap.set(book, booksMap.get(book) - 1);
      }
    } else {
      booksMap.set(book, booksMap.get(book) + 1);
    }
    if (options.removeAll) {
      booksMap.delete(book);
    }
    this.booksInCart.next(booksMap);
  }

  public getTotalAmount(booksMap: Map<Book, number>) {
    return Array.from(booksMap).reduce((acc, value) => acc + (value[0].price * value[1]), 0);
  }
}
