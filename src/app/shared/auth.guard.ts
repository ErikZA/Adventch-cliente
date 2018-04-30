import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';

import { Observable } from 'rxjs/Rx';
import { AuthService } from './auth.service';
import { User } from './models/user.model';
import { Modules } from './models/modules.enum';
import { Unit } from './models/unit.model';

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
        let unit = this.authService.getCurrentUnit();
        let module = this.authService.getModule(route._routerState.url);

        if(this.authService.checkPermission(module, unit))
            return true;
        if(user == null || user == undefined)
            this.router.navigate(['/login']);
        this.router.navigate(['/']);
    }
}
