import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IsLogin } from '../../actions/auth.action';
import { Routes, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { readUser } from 'src/app/actions/user.action';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public uri = environment.identityApiUrl;

  constructor(
    private store: Store<any>,
    private router: Router,
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
    this.http.get(`${this.uri}/Users/${id}`).subscribe((res: any) => {
      this.store.dispatch(readUser(res.data[0]))
    });
  }

  getMainToken() {
    return this.getLocalStorage("token");
  };

  setCurrentUser(user) {
    this.setLocalStorage("currentUser", user);
  };

  getCurrentUser() {
    const user = this.getLocalStorage("currentUser");
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
    this.router.navigate(['/'])
  }

}
