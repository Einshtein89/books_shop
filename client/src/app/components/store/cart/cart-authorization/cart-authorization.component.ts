import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../../services/auth/auth.service";
import {User} from "../../../../models/user.model";
import {TokenStorage} from "../../../../services/auth/token.storage";
import {TranslateService} from "@ngx-translate/core";
import {UserService} from "../../../../services/user/user.service";
import {CartService} from "../../../../services/cart/cart.service";

@Component({
  selector: 'app-cart-confirmation',
  templateUrl: './cart-authorization.component.html',
  styleUrls: ['./cart-authorization.component.less']
})
export class CartAuthorizationComponent implements OnInit {
  message: string;
  return: string = '';
  loggedInUser: User;

  constructor(public authService: AuthService,
              private tokenStorage: TokenStorage,
              public translate: TranslateService,
              private userService: UserService,
              public cartService: CartService) { }

  ngOnInit() {
    this.userService.loggedInUserAsObservable.subscribe(user => this.loggedInUser = user);
    if (this.authService.isLoggedIn() && !this.loggedInUser) {
      this.userService.getUserByUserName(this.tokenStorage.getUserId())
        .subscribe((user) => this.loggedInUser = new User(user));
    }
  }

  login(username: string, password: string): void {
    this.message = '';
    this.authService.login(username, password).subscribe(
      data => {
        this.tokenStorage.saveToken(data.token);
        if (!this.loggedInUser) {
          this.userService.getUserByUserName(this.tokenStorage.getUserId())
            .subscribe((user) => this.loggedInUser = new User(user));
        }
      },
      err => {
        if (err.status === 401) {
          this.message = this.translate.instant('login.page.form.incorrect.credentials.error');
          setTimeout(function() {
            this.message = '';
          }.bind(this), 2500);
        }
      }
    );
  }
}
