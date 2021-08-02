import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";
import {Router} from "@angular/router";
import {TokenStorage} from "../../../services/auth/token.storage";

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(public authService: AuthService,
              private router: Router,
              private tokenStorage: TokenStorage) { }

  ngOnInit() {
  }

  logout() {
    this.tokenStorage.signOut();
    this.router.navigate(['.']);
  }

}
