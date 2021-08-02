import {Component, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {User} from "../../../models/user.model";
import {EntityList} from "../../users/entity-list/entity-list.component";
import {Book} from "../../../models/book.model";
import {BooksList} from "../books-list/books-list.component";
import {ImageService} from "../../../services/image.service";
import {CatalogService} from "../../../services/book/catalog.service";
import {CartService} from "../../../services/cart/cart.service";
import {AddToCartPopupComponent} from "../../store/cart/add-to-cart/add-to-cart-popup.component";
declare var $ : any;

@Component({
  selector: 'book-single',
  templateUrl: './book-single.component.html',
  styleUrls: ['./book-single.component.css']
})
export class BookSingleComponent implements OnInit {
  @Input() book: Book;
  @Input() addToCartPopup: ViewContainerRef;
  @Input() bookListComponent: BooksList;
  imgSrc: any;


  constructor(private imageService: ImageService,
              private cartService: CartService) {
  }

  ngOnInit() {
    this.imgSrc = this.imageService.getImgSrc(this.book);
    $('.special.cards .image').dimmer({
      on: 'hover'
    });
  }

  getUserPhoto() {
    return this.imgSrc;
  }

  openAddToCartPopup() {
    this.cartService.addBookToCart(this.book);
    this.cartService.showAddToCartPopup(this.book, AddToCartPopupComponent, this.addToCartPopup, {})
  }
}
