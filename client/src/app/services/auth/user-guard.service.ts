import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AuthService} from "./auth.service";
import {UserService} from "../user/user.service";
import {User} from "../../models/user.model";
import {TokenStorage} from "./token.storage";

@Injectable()
export class UserGuard implements CanActivate {
  private loggedInUser: User;

  constructor(private auth: AuthService,
              private router: Router,
              private userService: UserService,
              private tokenStorage: TokenStorage) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const pathId = state.url.substring(state.url.lastIndexOf("/") + 1);
    if (this.auth.isLoggedIn() && this.isUserAllowedToEnter(pathId)) {
      return true;
    } else {
      this.router.navigate(['/login'], {
        queryParams: {
          return: state.url
        }
      });
    }

    return true;
  }

  private isUserAllowedToEnter(pathId) {
    if (Number.parseInt(pathId)) {
      // this.userService.loggedInUserAsObservable.subscribe(user => {
      //     this.loggedInUser = user;
      //     return this.auth.isAdmin() || this.loggedInUser.id == pathId;
      //   });

      // this.userService.getUserByUserName(this.tokenStorage.getUserId())
      //   .subscribe(
      //     data => {
      //       this.loggedInUser = data;
      return this.auth.isAdmin();
    //       }
    // );
    }

    return true;
  }
}
