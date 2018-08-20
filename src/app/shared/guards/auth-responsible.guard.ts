import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { tokenNotExpired } from 'angular2-jwt';
import { Responsible } from '../../modules/scholarship/models/responsible';
import { auth } from '../../auth/auth';

@Injectable()
export class AuthResponsibleGuard implements CanActivate {

  constructor(
    private router: Router
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
    if (tokenNotExpired('token')) {
      const responsible: Responsible = auth.getCurrentResponsible();
      if (responsible === null || responsible === undefined) {
        this.router.navigate(['/educacao']);
        return false;
      }
      return true;
    }
    this.router.navigate(['/educacao']);
    auth.logoffResponsible();
    return false;
  }
}
