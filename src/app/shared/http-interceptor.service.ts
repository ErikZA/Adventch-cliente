import { Injectable, Injector } from '@angular/core';
import { Http, ConnectionBackend, RequestOptions, RequestOptionsArgs, Request, Response, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import { tokenNotExpired } from 'angular2-jwt';

import { LockScreenService } from './../../app/core/components/lock-screen/lock-screen.service';

import { environment } from './../../environments/environment';

@Injectable()
export class HttpInterceptor extends Http {

    constructor(
        backend: ConnectionBackend, defaultOptions: RequestOptions,
        private _router: Router, private _injector: Injector) {
        super(backend, defaultOptions);
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.get(this.updateUrl(url), this.getRequestOptionArgs(options)));
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.post(this.updateUrl(url), body, this.getRequestOptionArgs(options)));
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.put(this.updateUrl(url), body, this.getRequestOptionArgs(options)));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.delete(this.updateUrl(url), this.getRequestOptionArgs(options)));
    }

    head(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.head(this.updateUrl(url), this.getRequestOptionArgs(options)));
    }

    patch(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.patch(this.updateUrl(url), body, this.getRequestOptionArgs(options)));
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.request(url, this.getRequestOptionArgs(options)));
    }

    updateUrl(url: string) {
        if (_.startsWith(url, './assets') || _.startsWith(url, environment.apiUrl))
            return url;
        return environment.apiUrl + url;
    }

    getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null)
            options = new RequestOptions();
        if (options.headers == null)
            options.headers = new Headers();
        options.headers.set('Content-Type', 'application/json');
        if (!_.endsWith(this._router.url, 'users/login'))
            options.headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
        return options;
    }

    intercept(observable: Observable<Response>): Observable<Response> {
        return observable.catch((err, source) => {
            if (err.status == 401 && !_.endsWith(err.url, 'users/login'))
                return this.lockScreen();
            else
                return Observable.throw(err);
        });
    }

    lockScreen(): Observable<Response> {
        let lockScreenService = this._injector.get(LockScreenService);
        let userName: string = JSON.parse(localStorage.getItem('currentUser'))['name'];
        let userPhotoUrl: string = JSON.parse(localStorage.getItem('currentUser'))['photoUrl'];
        lockScreenService.lockScreen(userName, userPhotoUrl);
        return Observable.empty();
    }

}
