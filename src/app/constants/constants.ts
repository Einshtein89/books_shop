import {environment} from "../../environments/environment";

export class Constants {
  public static baseUrl: string = window.location.origin;
  public static hostUrl: string = environment.production ? `${Constants.baseUrl}/api` : `http://localhost:3000/api`;
  public static books: string = '/books';
  public static users: string = '/users';
  public static photo: string = '/photos';
  public static photoUpload: string = '/userPhotoUpload';
  public static getBookByCatalogName: string = '/search/findByCatalogName';
  public static catalogName: string = 'catalogName=';
  public static catalogId: string = 'catalogId=';
  public static getBookByCatalogId: string = '/search/findByCatalogId';
  public static defaultPageSize: number = 10;
  public static signUp: string = '/signup';
  public static changePassword: string= '/changePassword';
  public static orders: string= '/orders';
  public static urlsWithoutRedirect: Array<string> = ['/cart/authorization'];
}
