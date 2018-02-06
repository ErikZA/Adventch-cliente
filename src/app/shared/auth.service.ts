import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/retry';

import { User } from './models/user.model';
import { environment } from './../../environments/environment';

@Injectable()
export class AuthService {

  currentUser = new EventEmitter<User>();
  showApp = new EventEmitter<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  loggedIn() {
    let user: User = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      this.currentUser.emit(user);
      this.showApp.emit(true);
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

  logoff() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    let user: User = new User();
    user.email = localStorage.getItem('lastLogin');
    this.currentUser.emit(user);
    this.showApp.emit(false);
    this.router.navigate(['/login']);
  }

}