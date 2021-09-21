import {Injectable} from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent,
  HttpResponse, HttpUserEvent, HttpErrorResponse, HttpEvent
} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Router, RouterStateSnapshot} from '@angular/router';
import {TokenStorage} from './token.storage';
import 'rxjs/add/operator/do';
import {Constants} from "../../constants/constants";

const TOKEN_HEADER_KEY = 'Authorization';
const BEARER = 'Bearer ';

@Injectable()
export class Interceptor implements HttpInterceptor {

  constructor(private token: TokenStorage, private router: Router, private state: RouterStateSnapshot) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    if (this.token.getToken() != null) {
      authReq = req.clone({headers: req.headers.set(TOKEN_HEADER_KEY, BEARER + this.token.getToken())});
    }
    return next.handle(authReq).do(
      (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          return event;
        }
      },
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status && err.status === 401 && !Constants.urlsWithoutRedirect.includes(this.router.url)) {
            this.router.navigate(['/login'], {
              queryParams: {
                return: document.location.pathname
              }
            });
          }
        }
      }
    );
  }
}
