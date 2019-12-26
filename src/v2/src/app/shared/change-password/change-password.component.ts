import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { FormGroup, Validators, FormBuilder, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';

import { ChangePasswordService } from './change-password.service';
import { StrongPasswordValidator } from '../../core/components/password/strong-password.directive';
import { AuthService } from '../auth.service';
import { auth } from '../../auth/auth';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
@AutoUnsubscribe()
export class ChangePasswordComponent implements OnInit, OnDestroy {

  form: FormGroup;
  hideNew = true;
  hideConfirm = true;
  strength: number;
  valFn: ValidatorFn;     // the validation function

  user_inputs: string[] = ['foobar', 'barfoo'];
  level = '2';

  subsFormPassword: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public snackBar: MatSnackBar,
    private changePasswordService: ChangePasswordService
  ) {
    this.valFn = StrongPasswordValidator(this.level, this.user_inputs);
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnDestroy(): void {

  }

  initForm() {
    this.form = this.fb.group({
      currentPassword: [null, Validators.required],
      passwords: this.fb.group({
        new: [null, [Validators.required, Validators.minLength(6), this.valFn]],
        confirm: [null, [Validators.required]]
      }, {
        validator: this.matchingPasswords('new', 'confirm')
      })
    });
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];
      if (password.value !== confirmPassword.value) {
        return { mismatchedPasswords: true };
      }
    };
  }

  onStrength({strength}) {
    this.strength = strength;
  }

  getMensage(): string {
    switch (this.strength) {
      case 0:
        return 'Senha muito fraca. Tente adicionar letras, simbolos e ou número.';
      case 1:
        return 'Senha fraca. Tente melhorar a complexidade da senha.';
      case 2:
        return 'Senha média.';
      case 3:
        return 'Senha forte.';
      case 4:
        return 'Senha extremamente forte.';
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.changePasswordService.changePassword(auth.getCurrentUser().id,
      this.form.get('currentPassword').value,
      this.subsFormPassword = this.form
      .get('passwords').value['new'])
      .subscribe((data) => {
      if (data && data.status && data.status === 105) {
        this.snackBar.open('Senha atual está errada!', 'OK', { duration: 10000 });
      } else {
        this.router.navigate(['/login']);
        auth.logoffMain();
        this.snackBar.open('Senha alterada! Agora, utilize a nova senha para acessar o sistema', 'OK', { duration: 10000 });
      }
    });
  }

  public changeComponent(event: boolean): void {
    if (event) {
      this.router.navigate(['/perfil/editar']);
    }
  }
}
