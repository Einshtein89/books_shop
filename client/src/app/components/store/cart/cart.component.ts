import {AfterContentChecked, AfterViewChecked, Component, OnInit} from '@angular/core';
import {MenuUtils} from "../../../utils/menu/menu.utils";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, AfterViewChecked {

  constructor(private menuUtils: MenuUtils) { }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    this.menuUtils.makeMenuItemActive();
  }
}
