import {
  AfterViewChecked, AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Book} from "../../../models/book.model";
import {BookService} from "../../../services/book/book.service";
import {CatalogService} from "../../../services/book/catalog.service";
import {PaginationService} from "../../../services/pagination.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.less']
})
export class BooksList implements OnInit, AfterViewChecked {
  loading: boolean;
  private statusCode: number;
  private books: Array<Book> = [];
  private booksByCategory: Array<Book> = [];
  private links: any;
  private page: any;
  name: string = 'book';
  @Input() category: string;
  private pageAll: any;
  @ViewChild('addToCartPopup', {read: ViewContainerRef}) addEditContainerRef;

  constructor(private bookService: BookService,
              private catalogService: CatalogService,
              private paginationService: PaginationService,
              private cdr: ChangeDetectorRef,
              private translate: TranslateService) { }

  ngOnInit() {
    this.paginationService.currentPageSize = 3;
    this.bookService.allBooksAsObservable.subscribe(books => this.books = books);
    this.bookService.allBooksByCategoryAsObservable.subscribe(booksByCategory =>
      this.booksByCategory = booksByCategory);
    if (!this.category) {
      this.bookService.pageAsObservable.subscribe(page => this.page = page);
      this.bookService.linksForAllBooksAsObservable.subscribe(links => this.links = links);
    } else {
      this.bookService.pageByCategoryAsObservable.subscribe(page => this.page = page);
      this.bookService.linksForCategoriesAsObservable.subscribe(links => this.links = links);
    }
    if (!this.booksByCategory && this.category) {
      this.getAllBooks(true);
      return;
    }
    if (!this.books) {
      this.getAllBooks(false);
      this.pageAll = this.page;
      return;
    }
  }

  private getAllBooks(isCategoryDefined: boolean) {
    this.loading = true;
    if (isCategoryDefined) {
      this.bookService.getBooksByCategoryId(this.category).subscribe(data => {
          this.populateEntities(data);
          this.populateCatalogs();
        },
        errorCode =>  this.statusCode = errorCode,
        () => this.loading = false
      );
      return;
    } else {
      this.bookService.getAllBooks().subscribe(data => {
          this.populateEntities(data);
          this.populateCatalogs();
        },
        errorCode =>  this.statusCode = errorCode,
        () => this.loading = false
      );
    }
    this.loading = false
  }

  public populateEntities(data: Object, isAdditionalDataNeeded?: boolean) {
    this.books = this.bookService.extractBooks(data);
    this.links = this.bookService.extractLinks(data);
    let extractedPage = this.bookService.extractPage(data);
    if (this.refreshView(extractedPage)) {
      this.bookService.refreshFilteredView = true;
    }
    this.page = extractedPage;
    if (isAdditionalDataNeeded) {
      this.populateCatalogs();
    }
  }

  private refreshView(extractedPage) {
    return this.category && (extractedPage.number != this.page.number
      || extractedPage.size != this.page.size);
  }

  private populateCatalogs() {
    this.books.forEach((book) => {
      this.catalogService.getCatalogByBook(book).subscribe(
        (catalog) =>  {
          book.catalog = catalog;
        }
    );
    })
  }

  private getSortOptions() {
    return Object.values(this.translate.instant(['empty.property', 'store.page.sort.by.price.from.lowest',
      'store.page.sort.by.price.from.highest']));
  }

  ngAfterViewChecked(): void {
    if (this.booksByCategory && this.category && !this.bookService.refreshFilteredView) {
      this.books = this.booksByCategory;
    }
    this.cdr.detectChanges();
  }
}
