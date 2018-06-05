import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';

import { AuthService } from '../../../shared/auth.service';

@Component({
  selector: 'lock-screen',
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.scss']
})
export class LockScreenComponent implements OnInit {

  public userName: string;
  public userPhotoUrl: string;

  @ViewChild('userPassword') userPassword: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<LockScreenComponent>,
    private authService: AuthService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.userPassword.nativeElement.focus();
  }

  unlock() {
    const email: string = JSON.parse(localStorage.getItem('currentUser'))['email'];
    const password: string = this.userPassword.nativeElement.value;
    if (password === '') {
      this.userPassword.nativeElement.focus();
      return;
    }
    localStorage.setItem('lastLogin', email);
    this.authService.login(email, password)
      .then(user => {
        this.dialogRef.close(true);
      })
      .catch((error: any) => {
        let errMsg: string;
        if (error && error.status === 401) {
          errMsg = error.statusText;
          this.userPassword.nativeElement.value = '';
          this.userPassword.nativeElement.focus();
          this.snackBar.open('Senha inválida!', 'OK', { duration: 3000 });
        } else {
          const body = error.json() || '';
          errMsg = `${error.status} - ${error.statusText || ''}`;
        }
        return Promise.reject(errMsg);
      });
  }

}
