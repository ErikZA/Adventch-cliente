import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/operators/retry';

import { User } from '../shared/models/user.model';
import { Responsible } from '../modules/scholarship/models/responsible';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  public loginMain(login: { email: string, password: string }): Observable<{ user: User, token: string}> {
    const url = '/shared/login';
    return this.http
      .post(url, login)
      .retry(3)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public loginResponsible(login: { cpf: string, password: string }): Observable<{ responsible: Responsible, token: string}> {
    const url = '/scholarship/responsible/login';
    return this.http
      .post(url, login)
      .retry(3)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public passwordRecovery(user: { email: string }): Observable<any> {
    const url = '/auth/password-recovery';
    return this.http
      .post(url, user)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
}
