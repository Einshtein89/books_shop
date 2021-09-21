import {Inject, Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {TokenStorage} from "./token.storage";
import {Constants} from "../../constants/constants";

@Injectable()
export class AuthService {

  constructor(private http: HttpClient,
              private tokenStorage: TokenStorage) { }

  login(email: string, password: string): Observable<any> {
    const credentials = {username: email, password: password};
    return this.http.post(`${Constants.hostUrl}/token/generate-token`, credentials);
  }

  isLoggedIn(): boolean {
    return this.tokenStorage.getToken() !== null;
  }

  isAdmin(): boolean {
    return this.tokenStorage.getUserRoles().includes("ROLE_ADMIN");
  }
}

export const AUTH_PROVIDERS: Array<any> = [
  { provide: AuthService, useClass: AuthService }
];



