import {
  AfterContentChecked, AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component, OnChanges,
  OnInit, SimpleChanges
} from '@angular/core';
import {AuthService} from "../../../../services/auth/auth.service";
import {TokenStorage} from "../../../../services/auth/token.storage";
import {TranslateService} from "@ngx-translate/core";
import {UserService} from "../../../../services/user/user.service";
import {CartService} from "../../../../services/cart/cart.service";
import {ImageService} from "../../../../services/image.service";
import {User} from "../../../../models/user.model";
import {OrderService} from "../../../../services/order/order.service";
import {Book} from "../../../../models/book.model";
import {LoadingUtils} from "../../../../utils/loading/loading.utils";
import {Router} from "@angular/router";

@Component({
  selector: 'app-cart-confirmation',
  templateUrl: './cart-confirmation.component.html',
  styleUrls: ['./cart-confirmation.component.less']
})
export class CartConfirmationComponent implements OnInit {
  private user: User;
  booksInCart: Map<Book, number> = new Map();
  booksInCartKeys: Array<Book>;
  errorList: any[];

  constructor(private router: Router,
              public authService: AuthService,
              private tokenStorage: TokenStorage,
              private translate: TranslateService,
              private userService: UserService,
              private cartService: CartService,
              private imageService: ImageService,
              private cdr: ChangeDetectorRef,
              private orderService: OrderService,
              private loadingUtils: LoadingUtils) {
  }

  ngOnInit() {
    if (this.booksInCart.size == 0) {
      this.cartService.booksInCartAsObservable.delay(0)
        .subscribe(booksInCart => {
          this.booksInCart = booksInCart;
          this.booksInCartKeys = Array.from(this.booksInCart.keys());
        });
    }
    this.userService.loggedInUserAsObservable.subscribe(user => this.user = user);
    if (this.authService.isLoggedIn() && !this.user) {
      this.userService.getUserByUserName(this.tokenStorage.getUserId())
        .subscribe((user) => this.user = new User(user));
    }
  }

  placeOrder(booksMap: Map<Book, number>) {
    this.loadingUtils.blockUI();
    this.orderService.placeOrder(booksMap).subscribe(
      (orderUniqueId) => {
        LoadingUtils.unblockUI();
        this.errorList = [];
        this.router.navigate(['cart/successfull'], { queryParams: { orderId: orderUniqueId } });
      },
      error => {
        this.errorList = [];
        this.errorList.push(error.error);
        this.errorList = this.userService.processErrors(this.errorList);
      }
    )
  }
}

