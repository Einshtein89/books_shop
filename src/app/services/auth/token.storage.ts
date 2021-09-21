import { Injectable } from '@angular/core';


const TOKEN_KEY = 'AuthToken';

@Injectable()
export class TokenStorage {

  public userRoles: string[];
  public userName: string;

  constructor() { }

  signOut() {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.clear();
  }

  public saveToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY,  token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public getUserRoles(): string[] {
    let decodedJwtData = this._parseToken(sessionStorage.getItem(TOKEN_KEY));
    this.userRoles = decodedJwtData['scopes'] ? decodedJwtData['scopes'].split(',') : [];
    return this.userRoles;
  }

  public getUserId(): string {
    let decodedJwtData = this._parseToken(sessionStorage.getItem(TOKEN_KEY));
    this.userName = decodedJwtData['sub'] ? decodedJwtData['sub'] : "";
    return this.userName;
  }


  private _parseToken(token : string) {
    if(!token) {
      return "";
    }
    let jwtData = token.split('.')[1];
    let decodedJwtJsonData = window.atob(jwtData);
    let decodedJwtData = JSON.parse(decodedJwtJsonData);
    return decodedJwtData;
  }
}
