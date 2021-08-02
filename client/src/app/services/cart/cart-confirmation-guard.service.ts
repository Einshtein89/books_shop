import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AuthService} from "../auth/auth.service";
import {UserService} from "../user/user.service";
import {TokenStorage} from "../auth/token.storage";

@Injectable()
export class CartConfirmationGuardService implements CanActivate {

  constructor(private auth: AuthService,
              private router: Router,
              private userService: UserService,
              private tokenStorage: TokenStorage) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.auth.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/authorization']);
    }

    return true;
  }

}
