import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../../services/user/user.service";
import {User} from "../../../../models/user.model";
import {TokenStorage} from "../../../../services/auth/token.storage";
import {AuthService} from "../../../../services/auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-order-successfull',
  templateUrl: './order-successfull.component.html',
  styleUrls: ['./order-successfull.component.css']
})
export class OrderSuccessfullComponent implements OnInit {
  orderId: any;

  constructor(private userService: UserService,
              private authService: AuthService,
              private tokenStorage: TokenStorage,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => this.orderId = params['orderId']);
  }
}
