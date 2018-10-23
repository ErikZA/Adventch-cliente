import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { auth } from '../../../auth';
import { Responsible } from '../../../../modules/scholarship/models/responsible';
import { AuthService } from '../../../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-responsible',
  templateUrl: './responsible.component.html',
  styleUrls: ['./responsible.component.scss']
})
@AutoUnsubscribe()
export class ResponsibleComponent implements OnInit, OnDestroy {

  @Input()
  loading = false;

  subsLogin: Subscription;

  constructor(
    private service: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    auth.logoffResponsible();
  }

  ngOnDestroy(): void {
  }

  public submitForm(loginForm: { login: string, password: string, remember: boolean}): void {
    this.loading = true;
    this.setLastLogin(loginForm);
    this.sendResquest(loginForm);
  }

  private sendResquest(loginForm: { login: string; password: string; remember: boolean; }) {
    this.subsLogin = this.service
    .loginResponsible({ cpf: loginForm.login, password: loginForm.password })
      .subscribe((data: {
        responsible: Responsible;
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

  private loginError(err: any) {
    this.loading = false;
    console.log(err);
    if (err.status === 500) {
      this.snackBar.open('CPF/senha inválido!', 'OK', { duration: 3000 });
    } else {
      this.snackBar.open('Erro no login.', 'OK', { duration: 3000 });
    }
  }

  private loginResponse(data: { responsible: Responsible; token: string; }) {
    const { responsible } = data;
    const { token } = data;
    if (responsible && token) {
      this.setResponsibleLoggedSuccess(responsible, token);
    } else {
      this.setResponsibleLoggedFail();
    }
    this.loading = false;
  }

  private setResponsibleLoggedFail() {
    const responsibleFail = new Responsible();
    responsibleFail.cpf = auth.getLastLogin();
    auth.currentResponsible.emit(responsibleFail);
    auth.showApp.emit(false);
  }

  private setResponsibleLoggedSuccess(responsible: Responsible, token: string) {
    auth.setCurrentResponsible(responsible);
    auth.setResponsibleToken(token);
    auth.currentResponsible.emit(responsible);
    auth.showApp.emit(true);
    this.router.navigate(['/educacao/consultar']);
  }
}
