import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { ScholarshipService } from '../../../scholarship.service';
import { Responsible } from '../../../models/responsible';

@Component({
  selector: 'app-responsible-login',
  templateUrl: './responsible-login.component.html',
  styleUrls: ['./responsible-login.component.scss']
})
export class ResponsibleLoginComponent implements OnInit {

  @ViewChild('userCPF') userCPF: ElementRef;
  @ViewChild('userPassword') userPassword: ElementRef;

  constructor(
    private scholarschipService: ScholarshipService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  login() {
    const cpf = this.userCPF.nativeElement;
    let password = this.userPassword.nativeElement;
    if (!cpf.value) {
      cpf.focus();
      return;
    }
    if (!password.value) {
      password.focus();
      return;
    }
    this.scholarschipService.login(cpf.value, password.value)
      .then(res => {
        const responsible = res as Responsible;
        if (!responsible || !responsible.id) {
          this.invalidLogin();
        } else {
          this.router.navigate(['/educacao/consultar']);
        }
      }).catch((err) => {
        if (err.status === 401) {
          this.invalidLogin();
          password.value = '';
          password.focus();
        }
      });
  }

  invalidLogin() {
    const snackBarRef = this.snackBar
      .open('CPF/senha inválido!', 'OK', { duration: 3000 })
      .afterDismissed()
      .subscribe(() => this.userPassword.nativeElement.focus());
  }

}
