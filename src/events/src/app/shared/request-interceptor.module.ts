import { Injectable, NgModule } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpHeaders
} from '@angular/common/http';

import * as _ from 'lodash';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class HttpsRequestInterceptor implements HttpInterceptor {
  constructor(private _router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { alias } = JSON.parse(localStorage.getItem("user"));
    let myHeaders = req.headers
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${JSON.parse(localStorage.getItem('token'))}`)
      .set('un-alias', alias);

    // if (!_.endsWith(this._router.url, 'auth/login') && !_.startsWith(this._router.url, 'https://viacep.com.br')) {
    //   myHeaders = myHeaders.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('token')));
    // }

    const authReq = req.clone({
      headers: myHeaders,
      url: this.updateUrl(req.url)
    });
    return next.handle(authReq);
  }

  updateUrl(url: string) {
    if (url.indexOf('./assets') >= 0 || _.startsWith(url, environment.eventsApiUrl) || _.startsWith(url, 'http')) {
      return url;
    }
    return environment.eventsApiUrl + url;
  }
}

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpsRequestInterceptor,
      multi: true
    }
  ]
})
export class RequestInterceptor { }