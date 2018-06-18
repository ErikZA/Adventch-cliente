import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../auth.service';
import { User } from '../models/user.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('userEmail') userEmail: ElementRef;
  @ViewChild('userPassword') userPassword: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    const user: User = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.identifier) {
      this.router.navigate(['']);
    }
    const email: string = localStorage.getItem('lastLogin');
    if (email) {
      this.userEmail.nativeElement.value = email;
    }
    const focusElement = !this.userEmail.nativeElement.value ? this.userEmail.nativeElement : this.userPassword.nativeElement;
    focusElement.focus();
  }

  login() {
    const email = this.userEmail.nativeElement;
    const password = this.userPassword.nativeElement;
    if (!email.value) {
      email.focus();
      return;
    }
    if (!password.value) {
      password.focus();
      return;
    }
    localStorage.setItem('lastLogin', email.value);
    this.authService.login(email.value, password.value)
      .then(res => {
        const user = res as User;
        if (!user || !user.identifier) {
          this.invalidLogin();
        } else {
          this.router.navigate(['']);
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
    const snackBarRef = this.snackBar.open('Usuário/senha inválido!', 'OK', { duration: 3000 })
      .afterDismissed()
      .subscribe(() => {
        this.userPassword.nativeElement.focus();
      });
  }

}
