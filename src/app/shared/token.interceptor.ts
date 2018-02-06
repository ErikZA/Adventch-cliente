import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestOptionsArgs, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';

import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';

import { environment } from './../../environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private _router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    if (!_.endsWith(this._router.url, 'shared/login'))
      myHeaders = myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

    const authReq = req.clone({
      headers: myHeaders,
      url: this.updateUrl(req.url)
    });
    return next.handle(authReq);
  }

  updateUrl(url: string) {
    if (_.startsWith(url, './assets') || _.startsWith(url, environment.apiUrl))
      return url;
    return environment.apiUrl + url;
  }
}