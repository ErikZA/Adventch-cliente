import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from '../../../auth';
import { LoginStore } from '../login.store';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(
    private store: LoginStore,
    private router: Router
  ) { }

  ngOnInit() {
    auth.logoffMain();
  }

  public submitForm(loginForm: { login: string, password: string, remember: boolean}): void {
    if (loginForm.remember) {
      auth.setLastLogin(loginForm.login);
    } else {
      auth.setLastLogin('');
    }
    this.store.loginMain({ email: loginForm.login, password: loginForm.password });
  }

  public sendEmailResetPassword(): void {
    this.router.navigate(['/recuperar-senha']);
  }
}
