import { tokenGetter } from './../../app.module';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { auth } from '../../auth/auth';

@Injectable()
export class AuthMainGuard implements CanActivate {

  constructor(
    private router: Router,
    public jwtHelper: JwtHelperService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAccess();
  }

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    return this.checkAccess();
  }

  private checkAccess() {
    const token = auth.getMainToken();
    if (!this.jwtHelper.isTokenExpired(token)) {
      const user: User = auth.getCurrentUser();
      if (user === null || user === undefined) {
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }
    this.router.navigate(['/login']);
    auth.logoffMain();
    return false;
  }
}
