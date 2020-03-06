import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IsLogin } from '../../action/auth.action';
import { Routes, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { readUser } from 'src/app/action/user.action';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public uri = environment.identityApiUrl;

  constructor(
    private store: Store<any>,
    private router: Router,
    private jwt: JwtHelperService,
    private http: HttpClient,
  ) { }

  checkLogin() {
    const token = this.getMainToken();
    if (token !== undefined && token !== null) {
      this.store.dispatch(IsLogin(true));
      this.getUser();
    } else {
      this.store.dispatch(IsLogin(false));
    }
  }

  getUser() {
    const { id } = JSON.parse(localStorage.getItem("user"));
    this.http.get(`${this.uri}/Users/${id}?UserId=${id}`).subscribe((res: any) => {
      this.store.dispatch(readUser(res.data[0]))
    });
  }

  validToken(token: string) {
    return this.http.get(`${this.uri}/Oauth2/${token}?Token=${token}`).toPromise();
  }

  decodeToken() {
    return this.jwt.decodeToken();
  }

  getMainToken() {
    return this.getLocalStorage("token");
  };

  setCurrentUser(user) {
    this.setLocalStorage("currentUser", user);
  };

  getCurrentUser() {
    const user = this.getLocalStorage("user");
    return user;
  }

  setLocalStorage(name: string, data: any) {
    localStorage.setItem(name, JSON.stringify(data));
  };

  getLocalStorage(name: string) {
    if (!localStorage.getItem(name)) {
      return null;
    }
    return this.parseJsonObject(localStorage.getItem(name));
  };

  parseJsonObject(data: any) {
    try {
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  };

  logout() {
    localStorage.clear();
    this.store.dispatch(IsLogin(false));
    this.router.navigate(['/login'])
  }

}
