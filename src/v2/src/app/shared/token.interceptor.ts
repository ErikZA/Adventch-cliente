import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestOptionsArgs, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';

import * as _ from 'lodash';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment.dev';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private _router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    if (req.url.indexOf('upload') > 0) { // TO DO: checar o motivo do formData não ser enviado no HttpClient
      return next.handle(req);
    }
    if (!_.endsWith(this._router.url, 'shared/login')) {
      myHeaders = myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    }

    const authReq = req.clone({
      headers: myHeaders,
      url: this.updateUrl(req.url)
    });
    return next.handle(authReq);
  }

  updateUrl(url: string) {
    if (_.startsWith(url, './assets') || _.startsWith(url, environment.apiUrl) || _.startsWith(url, environment.apiUrlReport)) {
      return url;
    }
    return environment.apiUrl + url;
  }
}
