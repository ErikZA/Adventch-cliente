import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ScholarshipService } from '../../scholarship.service';
import { Responsible } from '../../models/responsible';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-consult-login',
  templateUrl: './consult-login.component.html',
  styleUrls: ['./consult-login.component.scss']
})
export class ConsultLoginComponent implements OnInit {

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
    let cpf = this.userCPF.nativeElement;
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
        let responsible = res as Responsible;
        if (!responsible || !responsible.id)
          this.invalidLogin();
        else
          this.router.navigate(['/consultar-bolsas-login']);
      }).catch((err) => {
        if (err.status === 401) {
          this.invalidLogin();
          password.value = '';
          password.focus();
        }
      });
  }

  invalidLogin() {
    let snackBarRef = this.snackBar.open('CPF/senha inválido!', 'OK', { duration: 3000 }).afterDismissed().subscribe(() => this.userPassword.nativeElement.focus());
  }

}
