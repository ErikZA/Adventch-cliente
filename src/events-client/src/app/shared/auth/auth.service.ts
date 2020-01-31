import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IsLogin } from '../../actions/auth.action';
import { Routes, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private store: Store<any>,
    private router: Router
  ) { }

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
