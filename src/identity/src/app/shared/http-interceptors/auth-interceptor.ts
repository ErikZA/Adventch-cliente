import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, ICompanyUserAssociation } from '@adventech/ngx-adventech/auth/public-api';

import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    public snackBar: MatSnackBar,
    private translate: TranslateService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const companyAlias = (this.authService.getCurrentAssociation() || {} as ICompanyUserAssociation).companyAlias || '';
    const token = this.authService.getAccessToken() || '';
    const headers = req.headers
      .set('Authorization', 'Bearer ' + token)
      .set('un-alias', companyAlias);

    let requestedUrl = req.url;
    if (!req.url.startsWith('http') && !req.url.includes('/assets/')) {
      const apiUrl = environment.identityApiUrl;
      requestedUrl = req.url.includes(apiUrl) ? req.url : apiUrl + req.url;
    }

    const authReq = req.clone({
      headers,
      url: requestedUrl
    });

    return next.handle(authReq)
      .pipe(
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 0) {
              console.log('Check your internet connection and try again later');
            } else if (err.status === 401) {
              this.snackBar
                .open('Sua sessão expirou. Faça login novamente.', 'LOGIN', { duration: 15000 })
                .afterDismissed()
                .subscribe((res) => {
                  if (res) {
                    this.authService.logout(window.location.href);
                  }
                });
            } else if (err.status === 403) {
              this.snackBar.open('Permissão negada', 'OK', { duration: 3000 });
            } else if (err.status === 409) {
              this.snackBar.open(this.translate.instant('Já existe um data com as mesmas informações'), null, { duration: 3000 });
            } else if (err.status === 412) {
              this.snackBar.open('Essa empresa possui restrições de acesso', 'OK', { duration: 3000 });
            } else {
              this.snackBar.open(this.translate.instant('Ocorreu um erro'), null, { duration: 3000 });
            }
          }

          return throwError(err);
        })
      );
  }

}
