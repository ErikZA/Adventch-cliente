import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from '../../../auth';
import { AuthService } from '../../../auth.service';
import { User } from '../../../../shared/models/user.model';
import { MatSnackBar } from '@angular/material';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
@AutoUnsubscribe()
export class MainComponent implements OnInit, OnDestroy {

  loading = false;

  subsLogin: Subscription;

  constructor(
    private service: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    auth.logoffMain();
  }

  ngOnDestroy(): void {

  }

  public submitForm(loginForm: { login: string, password: string, remember: boolean}): void {
    this.loading = true;
    this.setLastLogin(loginForm);
    this.sendRequest(loginForm);
  }

  private sendRequest(loginForm: { login: string; password: string; remember: boolean; }) {
    this.subsLogin = this.service
    .loginMain({ email: loginForm.login, password: loginForm.password })
      .subscribe((data: {
        user: User;
        token: string;
      }) => {
        this.loginResponse(data);
      }, err => {
        this.loginError(err);
      });
  }

  private setLastLogin(loginForm: { login: string; password: string; remember: boolean; }) {
    if (loginForm.remember) {
      auth.setLastLogin(loginForm.login);
    } else {
      auth.setLastLogin('');
    }
  }

  private loginResponse(data: { user: User; token: string; }) {
    const { user } = data;
    const { token } = data;
    if (user && token) {
      this.setUserLoggedSuccess(user, token);
    } else {
      this.setUserLoggedFail();
    }
    this.loading = false;
  }

  private loginError(err: any) {
    this.loading = false;
    console.log(err);
    if (err.status === 500) {
      this.snackBar.open('Usuário/senha inválido!', 'OK', { duration: 3000 });
    } else {
      this.snackBar.open('Erro no login', 'OK', { duration: 3000 });
    }
  }

  private setUserLoggedFail() {
    const userFail = new User();
    userFail.email = auth.getLastLogin();
    auth.currentUser.emit(userFail);
    auth.showApp.emit(false);
  }

  private setUserLoggedSuccess(user: User, token: string) {
    user.firstName = user.name.split(' ')[0];
    auth.setCurrentUser(user);
    auth.setMainToken(token);
    auth.currentUser.emit(user);
    auth.showApp.emit(true);
    this.router.navigate(['/']);
  }

  public sendEmailResetPassword(): void {
    this.router.navigate(['/recuperar-senha']);
  }
}
