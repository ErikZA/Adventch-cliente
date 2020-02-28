import { Injectable, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable({
    providedIn: 'root'
})
export class oauth2AuthRoute implements CanActivate {

    public auth$: Observable<any>;
    public isLogin: boolean;

    constructor(
        private store: Store<any>,
        private router: Router,
        private routerActive: ActivatedRoute
    ) {
        this.auth$ = store.select('auth');
        this.auth$.subscribe((res: any) => this.isLogin = res);
    }

    checkAuthentication(path: string): boolean {

        if (!this.isLogin) {
            return true
        }

        return false
    }

    canActivate(activatedRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): boolean {

        this.routerActive.params.subscribe(res => console.log(res));

        return this.checkAuthentication(activatedRoute.routeConfig.path)
    }

}