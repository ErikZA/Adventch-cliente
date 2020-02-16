import { Injectable, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Route } from '@angular/compiler/src/core';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

    public auth$: Observable<any>;
    public isLogin: boolean;

    constructor(
        private router: Router,
        public jwtHelper: JwtHelperService,
        private service: AuthService,
        private store: Store<any>,
    ) {
        this.auth$ = store.select('auth');
        this.auth$.subscribe((res: any) => this.isLogin = res);
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        return this.checkAccess();
    }

    canLoad(route: Route): Observable<boolean> | boolean {
        return this.checkAccess();
    }

    private checkAccess(): boolean {
        const token = this.service.getMainToken();
        if (!this.jwtHelper.isTokenExpired(token) && token !== null && token !== undefined && this.isLogin) {
            // const user = this.service.getCurrentUser();
            // if (user === null || user === undefined) {
            //     this.router.navigate(['/']);
            //     return false;
            // }
            return true;
        }
        this.service.logout();
        return false;
    }
}