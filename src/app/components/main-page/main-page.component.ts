import { Component, OnInit } from '@angular/core';
import {IImage} from "ng-simple-slideshow";
import {Router} from "@angular/router";

@Component({
  selector: 'main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page-component.less']
})
export class MainPageComponent implements OnInit {
  imageUrlArray: (string | IImage)[];

  constructor(private router: Router) {
    this.imageUrlArray = [
      { url: '../../assets/carousel_main/book_store_1.jpg', caption: 'The first slide'},
      { url: '../../assets/carousel_main/book_store_2.jpg', caption: 'The second slide'},
      { url: '../../assets/carousel_main/book_store_3.jpg', caption: 'The third slide'},
    ];
  }

  ngOnInit() {
  }

  goToStore(): void {
    this.router.navigate(['./store']);
  }


}
