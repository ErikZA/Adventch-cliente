import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthRouteService implements CanActivate {

    public auth$: Observable<any>;
    public isLogin: boolean;

    constructor(
        private store: Store<any>,
        private router: Router
    ) {
        this.auth$ = store.select('auth');
        this.auth$.subscribe((res: any) => this.isLogin = res);
    }

    checkAuthentication(path: string): boolean {
        if (!this.isLogin) {
            return true
        }

        this.router.navigate(['/eventos'])

        return false
    }

    canActivate(activatedRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): boolean {
        return this.checkAuthentication(activatedRoute.routeConfig.path)
    }

}