import {Inject, Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import {User} from "../../models/user.model";
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Catalog} from "../../models/catalog.model";
import {Book} from "../../models/book.model";
import {Constants} from "../../constants/constants";

export const CATALOG_API_URL = `${Constants.hostUrl}/catalogs`;
export const DEFAULT_PAGE_SIZE = 10000;

@Injectable()
export class CatalogService {
  public entityList: User[];
  private options = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })};
  private allCatalogs = new BehaviorSubject<any>(null);
  private bookCatalog = new BehaviorSubject<any>(null);
  public currentCategory = new BehaviorSubject<string>(null);
  public allCatalogsAsObservable = this.allCatalogs.asObservable();
  public bookCatalogsAsObservable = this.bookCatalog.asObservable();
  public currentCategoryAsObservable = this.currentCategory.asObservable();
  public searchResults: User[];
  private catalogUrl: string = CATALOG_API_URL;
  private defaultPageSize: number = DEFAULT_PAGE_SIZE;

  constructor(private http: HttpClient) {
  }

  getAllCatalogs() {
    let params: string = [
      `size=${this.defaultPageSize}`
    ].join('&');
    return this.http.get(this.catalogUrl + `?${params}`)
      .do((res) => this.allCatalogs.next(this.extractCatalogs(res)))
      .catch(this._handleError)
  }

  getCatalogByBook(book: any) {
    return this.http.get(book['_links'].catalog.href)
      .do((res) => this.bookCatalog.next(res))
      .catch(this._handleError)
  }

  public extractCatalogs(res: any) : any {
    let body = res["_embedded"].catalogs;
    let result = [];
    if (body instanceof Array) {
      body.forEach((catalog) => result.push(new Catalog(catalog)))
    }
    return result;
  }

  private _handleError (error: HttpResponse<any> | any) {
    return Observable.throw(error);
  }


  public extractLinks(data: any) {
    return data["_links"];
  }

  public extractPage(data: any) {
    return data["page"];
  }


}
