import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/catch';

import { Unit } from './models/unit.model';
import { EModules } from './models/modules.enum';
import { Permission } from './models/permission.model';
import { Responsible } from '../modules/scholarship/models/responsible';

import { User } from './models/user.model';

@Injectable()
export class AuthService {

  currentUser = new EventEmitter<User>();
  showApp = new EventEmitter<boolean>();
  showMenu = new EventEmitter<boolean>();
  currentUnit = new EventEmitter<Unit>();
  permissions: Permission[];

  constructor(
    private http: HttpClient,
    private router: Router
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
    } else {
      this.router.navigate(['/login']);
    }
  }

  login(email: string, password: string) {
    const body = JSON.stringify({ email: email, password: password });
    return this.http
      .post<any>('/shared/login', body)
      .retry(3)
      .toPromise()
      .then(data => {
        let user = data.user as User;
        if (user) {
          user.firstName = user.name.split(' ')[0];
          // user.photoUrl = `${environment.apiUrl}/users/photo/${user.identifier}/${user.photoDate}`;
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', data.token);
          this.currentUser.emit(user);
          this.showApp.emit(true);
        } else {
          user = new User();
          user.email = localStorage.getItem('lastLogin');
          this.currentUser.emit(user);
          this.showApp.emit(false);
        }
        return user;
      }).catch((error: any) => {
        Promise.reject(error);
      });
  }

  logoff() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('currentUnit');
    localStorage.removeItem('currentResponsible');
    localStorage.removeItem('tokenResponsible');
    const user: User = new User();
    user.email = localStorage.getItem('lastLogin');
    this.currentUser.emit(user);
    this.showApp.emit(false);
    this.router.navigate(['/login']);
  }

  logoffResponsible() {
    localStorage.removeItem('currentResponsible');
    localStorage.removeItem('tokenResponsible');
    this.router.navigate(['/educacao']);
  }

  setCurrentUnit(unit) {
    localStorage.setItem('currentUnit', JSON.stringify(unit));
    this.currentUnit.emit();
  }

  getCurrentUnit() {
    const unit: Unit = JSON.parse(localStorage.getItem('currentUnit'));
    return unit;
  }

  getCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('currentUser'));
    return user;
  }

  getcurrentResponsible() {
    const responsible: Responsible = JSON.parse(localStorage.getItem('currentResponsible'));
    return responsible;
  }

  updatePermissions(permissions) {
    this.permissions = permissions;
    const user = this.getCurrentUser();
    user.permissions = permissions;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  checkPermission(module) {
    if (module === 0 || module === 1) { // Permissão liberada para "Geral" e "Aplicativos"
      return true;
    }
    if (this.permissions === undefined || this.permissions === null) {
      if (this.getCurrentUser().permissions === undefined || this.getCurrentUser().permissions === null) {
        return false;
      }
      this.permissions = this.getCurrentUser().permissions;
    }
    for (const permission of this.permissions) {
      if (permission.module === module) {
        return true;
      }
    }
    return false;
  }

  getModule(url: String) {
    if (url.toLowerCase().match('tesouraria')) {
        return EModules.Treasury;
    }
    if (url.toLowerCase().match('bolsas')) {
      return EModules.Scholarship;
    }
    if (url === '/') {
        return EModules.General;
    }
    return undefined;
  }

  checkAccess(url: String, unit: Unit) {
    return this.checkPermission(this.getModule(url));
  }

  getPermissions(): Observable<Permission[]> {
    const url = '/shared/getPermissions/' + this.getCurrentUser().id + '/' + this.getCurrentUnit().id;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  checkPermissionModule(idModule) {
    const url = '/shared/checkPermissionModule/' + this.getCurrentUser().id + '/' + this.getCurrentUnit().id + '/' + idModule;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
}
