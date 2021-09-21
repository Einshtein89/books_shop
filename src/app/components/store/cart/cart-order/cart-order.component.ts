import { Component, OnInit } from '@angular/core';
import {Book} from "../../../../models/book.model";
import {CartService} from "../../../../services/cart/cart.service";
import {ImageService} from "../../../../services/image.service";

@Component({
  selector: 'app-cart-order',
  templateUrl: './cart-order.component.html',
  styleUrls: ['./cart-order.component.less']
})
export class CartOrderComponent implements OnInit {
  allBooksInCart: Array<Book> = [];
  private booksMap: Map<Book, number> = new Map<Book, number>();

  constructor(private imageService: ImageService,
              private cartService: CartService) { }

  ngOnInit() {
    this.cartService.booksInCartAsObservable
      .subscribe(books => {
        this.allBooksInCart = Array.from(books.keys());
        this.booksMap = books;
      });
  }

  private getPhoto(book: Book) {
    return this.imageService.getImgSrc(book);
  }

}
