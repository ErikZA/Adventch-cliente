import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';

import { Observable } from 'rxjs/Rx';
import { AuthService } from './auth.service';
import { User } from './models/user.model';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.checkAccess(route, state);
    }

    canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
        return this.checkAccess(route);
    }

    private checkAccess(route, state?) {
        let user: User = JSON.parse(localStorage.getItem('currentUser'));
        if (user)
            return true;
        this.router.navigate(['/login']);
        return false;
    }

}
