import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CatalogService} from "../../../services/book/catalog.service";

@Component({
  selector: 'store-book-list',
  templateUrl: './store-book-list.component.html',
  styleUrls: ['./store-book-list.component.css']
})
export class StoreBookListComponent implements OnInit {
  category: string;

  constructor(private route: ActivatedRoute,
              private catalogService: CatalogService) {
    route.params.subscribe(params => { this.category = params['category']; });
    this.catalogService.currentCategory.next(this.category);
  }

  ngOnInit() {
  }

}
