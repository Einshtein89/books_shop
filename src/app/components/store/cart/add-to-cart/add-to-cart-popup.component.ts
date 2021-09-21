import { Component, OnInit } from '@angular/core';
import {User} from "../../../../models/user.model";
import {Book} from "../../../../models/book.model";
import {ImageService} from "../../../../services/image.service";
import {CartService} from "../../../../services/cart/cart.service";
import * as _ from "underscore";

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart-popup.component.html',
  styleUrls: ['./add-to-cart-popup.component.less']
})
export class AddToCartPopupComponent implements OnInit {
  private _ref:any;
  private _currentBook: Book;
  allBooksInCart: Array<Book> = [];
  private booksMap: Map<Book, number> = new Map<Book, number>();

  constructor(private imageService: ImageService,
              private cartService: CartService) { }

  ngOnInit() {
    $("#addToCartModal").modal(/*{backdrop: "static"}*/);
    this.cartService.booksInCartAsObservable
      .subscribe(books => {
        this.allBooksInCart = Array.from(books.keys());
        this.booksMap = books;
      });
  }

  private getPhoto(book: Book) {
    return this.imageService.getImgSrc(book);
  }

  removeModal(){
    $("#addToCartModal").modal('hide');
    this._ref.destroy();
  }

}
