import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import {User} from "../../models/user.model";
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Book} from "../../models/book.model";
import {CatalogService} from "./catalog.service";
import {Constants} from "../../constants/constants";

// export const BOOKS_API_URL = 'http://localhost:3000/books';
// export const DEFAULT_PAGE_SIZE = 10;

@Injectable()
export class BookService {
  private options = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  private allBooks = new BehaviorSubject<any>(null);
  private page = new BehaviorSubject<any>(null);
  private pageByCategory = new BehaviorSubject<any>(null);
  public allBooksByCategory = new BehaviorSubject<any>(null);
  private linksForCategories = new BehaviorSubject<any>(null);
  private linksForAllBooks = new BehaviorSubject<any>(null);
  public allBooksAsObservable = this.allBooks.asObservable();
  public allBooksByCategoryAsObservable = this.allBooksByCategory.asObservable();
  public pageAsObservable = this.page.asObservable();
  public pageByCategoryAsObservable = this.pageByCategory.asObservable();
  public linksForCategoriesAsObservable = this.linksForCategories.asObservable();
  public linksForAllBooksAsObservable = this.linksForAllBooks.asObservable();
  // private bookUrl: string = BOOKS_API_URL;
  private defaultPageSize: number = 3;
  private getBooksByCatalogLink: any;
  refreshFilteredView: boolean;

  constructor(private http: HttpClient,
              private catalogService: CatalogService) {
  }

  getAllBooks() {
    let params: string = [
      // `size=${this.defaultPageSize}`
      `size=3`
    ].join('&');
    return this.http.get<Book[]>(`${Constants.hostUrl}${Constants.books}?${params}`)
      .do((res) => {
        this.populateBooks(res, false);
        this.linksForAllBooks.next(res["_links"]);
        this.page.next(this.extractPage(res));
      })
      .catch(this._handleError)
  }

  getBooksByCategoryId(catalogId: string) {
    let params: string = [
      `catalogId=${catalogId}`,
      `size=${this.defaultPageSize}`
    ].join('&');
    let queryUrl: string = `${Constants.hostUrl}${Constants.books}${Constants.getBookByCatalogId}?${params}`;
    return this.http.get<Book[]>(queryUrl)
      .do((res) => {
        this.populateBooks(res, true);
        this.pageByCategory.next(this.extractPage(res));
      })
      .catch(this._handleError)
  }

  getBooksByCategoryName(catalogName: string) {
    let params: string = [
      `catalogName=${catalogName}`,
      `size=${this.defaultPageSize}`
    ].join('&');
    let queryUrl: string = `${Constants.hostUrl}${Constants.books}${Constants.getBookByCatalogName}?${params}`;
    return this.http.get<Book[]>(queryUrl)
      .do((res) => {
        this.populateBooks(res, true);
        this.pageByCategory.next(this.extractPage(res));
      })
      .catch(this._handleError)
  }

  public extractBooks(res: any): any {
    let result = [];
    if (res) {
      let body = res["_embedded"].books;
      if (body instanceof Array) {
        body.forEach((book) => result.push(new Book(book)))
      }
    }
    return result;
  }

  public populateBooks(res: any,  isCategoryDefined: boolean) {
    let books = this.extractBooks(res);
    books.forEach((book) => this.catalogService.getCatalogByBook(book)
      .subscribe((catalog) => book['catalog'] = catalog));
    if (isCategoryDefined) {
      this.allBooksByCategory.next(books);
      return;
    }
    this.allBooks.next(books);
  }


  public populateLinks(res: Book[] | any) {
    this.linksForCategories.next(res["_links"]);
    return res["_links"];
  }

  private _handleError(error: HttpResponse<any> | any) {
    return Observable.throw(error);
  }

  public extractLinks(data: any) {
    return data["_links"];
  }

  public extractPage(data: any) {
    return data["page"];
  }
}
