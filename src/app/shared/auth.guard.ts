import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';
import { User } from './models/user.model';
import { EModules } from './models/modules.enum';
import { Unit } from './models/unit.model';
import { Permission } from './models/permission.model';
import { tokenNotExpired } from 'angular2-jwt';
import { Responsible } from '../modules/scholarship/models/responsible';


@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

    public permissions: any;
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
        if (window.location.pathname.startsWith('/educacao')) {
            return this.checkAccessResponsible();
        }
        return this.checkAccessUser(route, state);
    }

    private checkAccessUser(route, state?) {
        if (tokenNotExpired('token')) {
            const user: User = JSON.parse(localStorage.getItem('currentUser'));
            if (user == null || user === undefined) {
                this.router.navigate(['/login']);
                return false;
            }

            const module = this.authService.getModule(route._routerState.url);
            if (this.authService.checkPermission(module)) {
                return true;
            }
            this.router.navigate(['/']);
            return true;
        }
        this.authService.logoff();
        this.router.navigate(['/login']);
        return false;
    }

    private checkAccessResponsible() {
        if (tokenNotExpired('tokenResponsible')) {
            const responsible: Responsible = JSON.parse(localStorage.getItem('currentResponsible'));
            if (responsible != null && responsible !== undefined) {
                return true;
            }
            return false;
        }
        this.router.navigate(['/educacao']);
        return false;
    }
}
