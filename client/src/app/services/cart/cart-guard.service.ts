import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {CartService} from "./cart.service";
import {Location} from "@angular/common";

@Injectable()
export class CartGuard implements CanActivate {

  constructor(private router: Router,
              private cartService: CartService,
              private location: Location) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // let cartSize = this.cartService.booksInCart.getValue().size;
    // if (cartSize == 0) {
    //   // this.cartService.shouldDisplayEmptyCartPopup.next(true);
    //   if (this.router.url == '/') {
    //     this.location.back();
    //   }
    // }
    return true
  }
}
