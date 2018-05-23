import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/retry';

import { User } from './models/user.model';
import { environment } from './../../environments/environment';
import { Unit } from './models/unit.model';
import { EModules } from './models/modules.enum';

@Injectable()
export class AuthService {

  currentUser = new EventEmitter<User>();
  showApp = new EventEmitter<boolean>();
  showMenu = new EventEmitter<boolean>();
  currentUnit = new EventEmitter<Unit>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  loggedIn() {
    let user: User = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      this.currentUser.emit(user);
      this.showApp.emit(true);
    } else {
      this.router.navigate(['/login']);
    }
  }

  login(email: string, password: string) {
    let body = JSON.stringify({ email: email, password: password });
    return this.http
      .post<any>('/shared/login', body)
      .retry(3)
      .toPromise()
      .then(data => {
        let user = data.user as User;
        if (user) {
          user.firstName = user.name.split(' ')[0];
          //user.photoUrl = `${environment.apiUrl}/users/photo/${user.identifier}/${user.photoDate}`;
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', data.token);
          this.currentUser.emit(user);
          this.showApp.emit(true);
        }
        else {
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

  public visibleModule() {
    /*let { permissions } = this.getCurrentUnit();
    for (const permission of permissions) {
      switch (permission.module) {
        case Modules.Treasury:
          return permission.access;
        default:
          this.router.navigate(['']);
          return false;
      }
    }*/
    console.log('teste');
  }

  logoff() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('currentUnit');
    let user: User = new User();
    user.email = localStorage.getItem('lastLogin');
    this.currentUser.emit(user);
    this.showApp.emit(false);
    this.router.navigate(['/login']);
  }

  setCurrentUnit(unit){
    localStorage.setItem('currentUnit', JSON.stringify(unit));
    this.currentUnit.emit();
  }

  getCurrentUnit(){
    let unit: Unit = JSON.parse(localStorage.getItem('currentUnit'));
    return unit;
  }

  getCurrentUser(){    
    let user: User = JSON.parse(localStorage.getItem('currentUser'));
    return user;
  }

  updatePermissions(permissions){
    let user = this.getCurrentUser();
    user.permissions = permissions;
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUser.emit(user);
  }

  checkPermission(module: EModules, unit: Unit) {
  /*
    if(module == Modules.Dashboard)
        return true;

    if(module == Modules.Scholarship)
      return this.getCurrentUser().isScholarship;
*/
return true;
    /*if(unit == undefined || module == undefined)
      return false;

    for (const permission of unit.permissions) {
      if (permission.module == module)
        return permission.access;
    }
    return false;*/
  }

  getModule(url: String){
    if(url.toLowerCase().match("tesouraria"))
        return EModules.Treasury;
    if(url.toLowerCase().match("bolsas"))
      return EModules.Scholarship;
    if(url == "/")
        return EModules.General;
    return undefined;
  }

  checkAccess(url: String, unit: Unit){
    return this.checkPermission(this.getModule(url), unit);
  }
}
