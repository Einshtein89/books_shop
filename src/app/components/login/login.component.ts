import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import {ActivatedRoute, Router} from "@angular/router";
import {TokenStorage} from "../../services/auth/token.storage";
import {TranslateService} from "@ngx-translate/core";
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent {
  message: string;
  return: string = '';

  constructor(public authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private tokenStorage: TokenStorage,
              public translate: TranslateService,
              private userService: UserService) {
    this.message = '';
    this.route.queryParams
      .subscribe(params => this.return = params['return'] || '/home');
  }

  login(username: string, password: string): void {
    this.message = '';
    this.authService.login(username, password).subscribe(
      data => {
        this.tokenStorage.saveToken(data.token);
        this.router.navigateByUrl(this.return);
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

  logout(): boolean {
    this.tokenStorage.signOut();
    this.router.navigate(['/login']);
    return false;
  }

}
