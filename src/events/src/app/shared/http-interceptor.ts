import { Injectable, NgModule } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

import { environment } from '../../environments/environment';
import { AuthService } from './auth/auth.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(
    public login: AuthService,
    private snackBar: MatSnackBar
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { alias } = JSON.parse(localStorage.getItem("user")) || '';
    const token = JSON.parse(localStorage.getItem("token"));

    const headers = request.headers
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .set('un-alias', alias);

    let requestedUrl = request.url;
    if (!request.url.startsWith('http') && !request.url.includes('/assets/')) {
      const apiUrl = environment.identityApiUrl;
      requestedUrl = request.url.includes(apiUrl) ? request.url : apiUrl + request.url;
    }

    const authReq = request.clone({
      headers,
      url: requestedUrl
    })

    return next.handle(authReq)
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          switch (error.status) {
            case 401:
              this.snackBar.open("Você não tem permissão", "OK", { duration: 2000 })
              this.login.logout();
            case 400:
              this.snackBar.open(error.error.errorMessage, "Fechar", { duration: 3000 })
            case 409:
              this.snackBar.open(error.error.errorMessage, "Fechar", { duration: 2000 })
          }
          return throwError(error.error);
        })
      );
  }

}
