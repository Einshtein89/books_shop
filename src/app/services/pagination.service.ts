import {Inject, Injectable, OnDestroy, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Constants} from "../constants/constants";



@Injectable()
export class PaginationService {

  sortBy: string = "";
  private userUrl: string = `${Constants.hostUrl}${Constants.users}`;
  private booksUrl: string = `${Constants.hostUrl}${Constants.books}`;
  public defaultPageSize: number = Constants.defaultPageSize;
  currentPageSize: number = this.defaultPageSize;

  constructor(private http:HttpClient) {
    this.urls();
  }

  getPageByNumber(page: number, key: string, sortOption?:string, specialLink?: string) {
    let params: string = [
      `size=${this.currentPageSize ? this.currentPageSize : this.defaultPageSize}`,
      `page=${page}`,
      `sort=${sortOption}`
    ].join('&');
    let queryUrl: string = specialLink ? specialLink : `${this.urls().get(key)}?${params}`;
    return this.http.get(queryUrl);
  }

  getPageByLink(pageLink: string) {
    return this.http.get(pageLink);
  }

  private urls() {
    let urls = new Map();
    urls.set("user", this.userUrl);
    urls.set("book", this.booksUrl);
    return urls;
  }
}
