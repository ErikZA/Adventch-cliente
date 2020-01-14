import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RecoverStore } from '../recover.store';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-recover-main',
  templateUrl: './recover-main.component.html',
  styleUrls: ['./recover-main.component.scss']
})
export class RecoverMainComponent implements OnInit {

  formEmail: FormGroup;
  emailSend = false;
  isSendEmail = false;

  constructor(
    private store: RecoverStore,
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm(): void {
    this.formEmail = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]]
    });
  }

  public sendEmailRequest(): void {
    if (this.formEmail.valid) {
      this.isSendEmail = !this.isSendEmail;
      this.store.sendEmailResetPasswordRecovery(this.formEmail.value)
        .subscribe(() => {
          this.isSendEmail = !this.isSendEmail;
          this.emailSend = true;
        }, err => {
          this.emailSend = false;
          this.isSendEmail = false;
          this.snackBar.open('Erro ao enviar email, tente novamente.', 'OK', { duration: 10000 });
        });
    }
  }

  public goBackLogin(): void {
    this.router.navigate(['/login']);
  }
}
