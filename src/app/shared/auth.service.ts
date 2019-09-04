
import { auth } from '../auth/auth';
import { SharedService } from './shared.service';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Unit } from './models/unit.model';
import { EModules } from './models/modules.enum';
import { Permission } from './models/permission.model';
import { Responsible } from '../modules/scholarship/models/responsible';

import { User } from './models/user.model';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthService {

  currentUser = new EventEmitter<User>();
  showApp = new EventEmitter<boolean>();
  showMenu = new EventEmitter<boolean>();
  currentUnit = new EventEmitter<Unit>();
  permissions: Permission[];

  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService
  ) { }

  loggedIn() {
    const user: User = this.getCurrentUser();
    if (user) {
      this.currentUser.emit(user);
      this.showApp.emit(true);
    } else {
      this.redirectAccess();
    }
  }

  redirectAccess() {
    if (window.location.pathname.startsWith('/educacao')) {
      const responsible: Responsible = this.getcurrentResponsible();
      if (responsible) {
        this.router.navigate(['/educacao/consultar']);
      } else {
        this.router.navigate(['/educacao']);
      }
    } else if (!window.location.pathname.startsWith('/resetar-senha')) {
      this.router.navigate(['/login']);
    }
  }

  logoffResponsible() {
    this.router.navigate(['/educacao']);
    auth.logoffResponsible();
  }

  public setCurrentUnit(unit: Unit): void {
    auth.setCurrentUnit(unit);
    this.setPermissionsUser(unit.id);
  }

  private setPermissionsUser(unitId: number) {
    const token = auth.getMainToken();

    if (!!token) {
      const unitIdClaim = auth.decodeToken(token).userUnitId;
      if (unitIdClaim === unitId) {
        return;
      }
      this.http.get(`/auth/token/renew/${unitId}`)
        .pipe(tap(() => {
          this.router.navigate(['/']);
          window.location.reload();
        }))
        .subscribe((t: any) => {
          auth.setMainToken(t.token);
        });
    }
  }
  renewUserToken(): void {
    const token = auth.getMainToken();
    const unitId = auth.decodeToken(token).userUnitId;
    if (typeof unitId === 'undefined') {
      return;
    }
    this.http.get(`/auth/token/renew/${unitId}`)
      .pipe(tap(() => {
        this.router.navigate(['/']);
        window.location.reload();
      }))
      .subscribe((t: any) => {
        auth.setMainToken(t.token);
      });
  }
  redirectToHome(): void {
    this.router.navigate(['/']);
  }

  getCurrentUnit() {
    return auth.getCurrentUnit();
  }

  getCurrentUser() {
    return auth.getCurrentUser();
  }

  setCurrentUser(user: User) {
    auth.setCurrentUser(user);
  }

  getcurrentResponsible() {
    return auth.getCurrentResponsible();
  }

  public checkUserIsAdmin(): boolean {
    const user = auth.getCurrentUser();
    if (user) {
      const { isSysAdmin } = user;
      if (isSysAdmin) {
        return !!isSysAdmin;
      }
    }
    return false;
  }

  public checkModuleAccess(module: EModules): boolean {
    const modules = this.getCurrentUnit() ? this.getCurrentUnit().modules : undefined;
    if (!module || !Array.isArray(modules)) {
      return false;
    }

    return modules.includes(module);
  }
}
