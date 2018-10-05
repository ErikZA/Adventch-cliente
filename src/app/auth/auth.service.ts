
import { throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../shared/models/user.model';
import { Responsible } from '../modules/scholarship/models/responsible';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  public loginMain(login: { email: string, password: string }): Observable<{ user: User, token: string }> {
    const url = '/shared/login';
    return this.http
      .post<{ user: User, token: string }>(url, login);
  }

  public loginResponsible(login: { cpf: string, password: string }): Observable<{ responsible: Responsible, token: string}> {
    const url = '/scholarship/responsible/login';
    return this.http
      .post<{ responsible: Responsible, token: string}>(url, login);
  }

  public passwordRecovery(user: { email: string }): Observable<any> {
    const url = '/auth/password-recovery';
    return this.http
      .post<any>(url, user);
  }
}
