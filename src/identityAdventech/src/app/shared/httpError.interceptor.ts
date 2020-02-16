import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse
} from '@angular/common/http';


import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthService } from './auth/auth.service';

import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(
        public login: AuthService,
        private snackBar: MatSnackBar
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = JSON.stringify(localStorage.getItem("token"));
        const companyAlias = '';
        const headers = request.headers
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('un-alias', companyAlias);

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
                    if (error.status === 401) {
                        this.snackBar.open("Você não tem permissão", "OK", { duration: 2000 })
                        this.login.logout();
                    }
                    return throwError(error.error);
                })
            );
    }
}