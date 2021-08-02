import {AfterContentChecked, AfterContentInit, AfterViewInit, Component, OnInit} from '@angular/core';
import {BookService} from "../../../services/book/book.service";
import {Book} from "../../../models/book.model";
import {CatalogService} from "../../../services/book/catalog.service";
import {Catalog} from "../../../models/catalog.model";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {CartService} from "../../../services/cart/cart.service";
import {MenuUtils} from "../../../utils/menu/menu.utils";

@Component({
  selector: 'store-main',
  templateUrl: './store-main.component.html',
  styleUrls: ['./store-main.component.less']
})
export class StoreMainComponent implements OnInit, AfterContentChecked {
  private loading: boolean;
  private statusCode: number;
  catalogs: Array<Catalog> = [];
  private catalogsWithTranslations: Map<string, string> = new Map<string, string>();
  private currentCategory: string;

  // private books: Array<Book> = [];
  private links: any;
  private page: any;

  constructor(private catalogService: CatalogService,
              private bookService: BookService,
              private translate: TranslateService,
              private cartService: CartService,
              private menuUtils: MenuUtils) {
  }

  ngOnInit() {
    this.catalogService.allCatalogsAsObservable.subscribe(catalogs => this.catalogs = catalogs);
    this.catalogService.currentCategoryAsObservable.subscribe(category => this.currentCategory = category);
    // this.bookService.allBooksAsObservable.subscribe(books => this.books = books);
    if (!this.catalogs) {
      this.getAllCatalogs();
    } else {
      this.populateCatalogNames(this.catalogs);
    }
  }

  private getAllCatalogs() {
    this.loading = true;
    this.catalogService.getAllCatalogs().subscribe(data => {
        this.populateEntities(data)
      },
      errorCode =>  this.statusCode = errorCode,
      () => this.loading = false
    );
  }

  private populateEntities(data: Object) {
    this.catalogs = this.catalogService.extractCatalogs(data);
    this.links = this.catalogService.extractLinks(data);
    this.page = this.catalogService.extractPage(data);
    this.populateCatalogNames(this.catalogs);
  }

  private filterByCategory(catalog: Catalog) {
    this.catalogService.currentCategory.next(catalog.name);
    this.bookService.getBooksByCategoryId(catalog.id).subscribe(
      res => {
        this.bookService.populateBooks(res, true);
        this.bookService.populateLinks(res);
        this.bookService.refreshFilteredView = false;
        this.links = this.catalogService.extractLinks(res);
        this.page = this.catalogService.extractPage(res);
      }

    );
  }

  private getCatalogName(name: string) {
    return this.translate.instant(this.catalogsWithTranslations.get(name))
  }

  private populateCatalogNames(catalogs: Array<Catalog>) {
    catalogs.forEach((catalog) =>
      this.catalogsWithTranslations.set(catalog.name, `store.catalog.${catalog.name}`)
    );
  }

  ngAfterContentChecked(): void {
    this.menuUtils.makeMenuItemActive();
  }

}
