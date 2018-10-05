import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';

import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material';



@Injectable()
export class AdminGuard implements CanActivate, CanLoad {

    public permissions: any;
    constructor(
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
      return this.checkAccess();
    }

    canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
      return this.checkAccess();
    }

    private checkAccess() {
      if (!this.authService.checkUserIsAdmin()) {
        this.snackBar.open('Seu usúario não possui permissão para acessar essa página', 'OK', { duration: 1000 });
      }
      return this.authService.checkUserIsAdmin();
    }
}
