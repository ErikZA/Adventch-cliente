import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { AuthService } from '../auth.service';
import { EModules } from '../models/modules.enum';
import { MatSnackBar } from '@angular/material';


@Injectable()
export class ModuleGuard implements CanActivate, CanLoad {

  public permissions: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.checkAccess(route.data.module);
  }

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    return this.checkAccess(route.data.module);
  }

  private checkAccess(module: EModules) {
    if (!this.authService.checkModuleAccess(module)) {
      this.message();
      this.redirect();
    }
    return this.authService.checkModuleAccess(module);
  }
  private message() {
    this.snackBar.open('Sua unidade não possui permissão para acessar esse módulo', 'OK', { duration: 3000 });
  }
  private redirect(): void {
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
}
