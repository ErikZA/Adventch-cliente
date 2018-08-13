import { Component, OnInit } from '@angular/core';
import { LoginStore } from '../login.store';
import { auth } from '../../../auth';

@Component({
  selector: 'app-responsible',
  templateUrl: './responsible.component.html',
  styleUrls: ['./responsible.component.scss']
})
export class ResponsibleComponent implements OnInit {

  constructor(
    private store: LoginStore
  ) { }

  ngOnInit() {
    auth.logoffResponsible();
  }

  public submitForm(loginForm: { login: string, password: string, remember: boolean}): void {
    if (loginForm.remember) {
      auth.setLastLogin(loginForm.login);
    } else {
      auth.setLastLogin('');
    }
    this.store.loginResponsible({ cpf: loginForm.login, password: loginForm.password });
  }
}
