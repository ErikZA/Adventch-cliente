import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Responsible } from '../../../modules/scholarship/models/responsible';
import { User } from '../../../shared/models/user.model';

import { AuthService } from '../../auth.service';
import { auth } from '../../auth';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class LoginStore {

  constructor(
    private service: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  public loginMain(login: { email: string, password: string }): void {
    this.service.loginMain(login).subscribe((data: { user: User, token: string}) => {
      const { user } = data;
      const { token } = data;
      if (user && token) {
        user.firstName = user.name.split(' ')[0];
        auth.setCurrentUser(user);
        auth.setMainToken(token);
        auth.currentUser.emit(user);
        auth.showApp.emit(true);
        this.router.navigate(['/']);
      } else {
        const userFail = new User();
        userFail.email = auth.getLastLogin();
        auth.currentUser.emit(userFail);
        auth.showApp.emit(false);
      }
    }, err => {
      console.log(err);
      if (err.status === 500) {
        this.snackBar.open('Usuário/senha inválido!', 'OK', { duration: 3000 });
      } else {
        this.snackBar.open('Erro no login', 'OK', { duration: 3000 });
      }
    });
  }

  public loginResponsible(login: { cpf: string, password: string }): void {
    this.service.loginResponsible(login).subscribe((data: { responsible: Responsible, token: string}) => {
      const { responsible } = data;
      const { token } = data;
      if (responsible && token) {
        auth.setCurrentResponsible(responsible);
        auth.setResponsibleToken(token);
        auth.currentResponsible.emit(responsible);
        auth.showApp.emit(true);
        this.router.navigate(['/educacao/consultar']);
      } else {
        const responsibleFail = new Responsible();
        responsibleFail.cpf = auth.getLastLogin();
        auth.currentResponsible.emit(responsibleFail);
        auth.showApp.emit(false);
      }
    }, err => {
      console.log(err);
      if (err.status === 401) {
        this.snackBar.open('CPF/senha inválido!', 'OK', { duration: 3000 });
      } else {
        this.snackBar.open('Erro no login.', 'OK', { duration: 3000 });
      }
    });
  }

  public logoff(): void {
    this.router.navigate(['/login']);
    auth.logoffMain();
  }

  public logoffResponsible(): void {
    this.router.navigate(['/educacao']);
    auth.logoffResponsible();
  }
}
