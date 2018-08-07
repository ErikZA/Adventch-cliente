import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RedefinePasswordGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAccess(next);
  }

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
      return this.checkAccess(route);
  }

  private checkAccess(route: any): boolean {
    console.log(route);
    return true;
  }
}
