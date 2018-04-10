import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';

import { ChangePasswordService } from './change-password.service';
import { StrongPasswordValidator } from '../strong-password.directive';
import { User } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  form: FormGroup;
  hideNew = true;
  hideConfirm = true;
  strength: number;
  valFn: ValidatorFn;     // the validation function

  user_inputs: string[] = ['foobar', 'barfoo'];
  level = '2';
  // adminChangePassword: boolean = false;
  // params = {
  //   required: {
  //     current: { field: '' },
  //     new: { field: '' },
  //     confirm: { field: '' }
  //   },
  // };
  // user: User;

  constructor(
    private fb: FormBuilder,
    // private changePasswordService: ChangePasswordService,
    private router: Router,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ChangePasswordComponent>
  ) {
    this.valFn = StrongPasswordValidator(this.level, this.user_inputs);
  }

  ngOnInit() {
    this.initForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
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
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];
      if (password.value !== confirmPassword.value)
        return { mismatchedPasswords: true };
    }
  }

  onStrength({strength}) {
    this.strength = strength;
  }

  cancel() {
    this.dialogRef.close(false);
  }

  getMensage(): string {
    switch (this.strength) {
      case 0:
        return "Senha muito fraca. Tente adicionar letras, simbolos e ou número.";
      case 1:
        return "Senha fraca. Tente melhorar a complexidade da senha.";
      case 2:
        return "Senha média.";
      case 3:
        return "Senha forte.";
      case 4:
        return "Senha estremamente forte."
    }
  }

  onSubmit(e) {
    if (e) e.preventDefault();

    if (this.form.invalid) return;

      // if (this.router.url.indexOf('servicos') !== -1)
      //   this.changePasswordService.changePasswordCooperated(this.form.get('currentPassword').value, this.form.get('passwords').get('new').value).then((data) => {
      //     if (data && data.status && data.status === 210)
      //       this.snackBar.open('Senha atual está errada!', 'OK', { duration: 10000 });
      //     else
      //       this.snackBar.open('Senha alterada!', 'OK', { duration: 10000 });
      //   });
      // else if (this.router.url.indexOf('atendimento') !== -1)
      //   this.changePasswordService.changePasswordAdmin(this.form.get('currentPassword').value, this.form.get('passwords').get('new').value).then((data) => {
      //     if (data && data.status && data.status === 210)
      //       this.snackBar.open('Senha atual está errada!', 'OK', { duration: 10000 });
      //     else
      //       this.snackBar.open('Senha alterada!', 'OK', { duration: 10000 });
      //   });

      // if (this.dialogRef.componentInstance.adminChangePassword) { // Quando o gestor for alterara senha de algum atendente
      //   this.changePasswordService.managerChangePassword(this.user.id, this.form.get('passwords').get('new').value).then((data) => {
      //     this.snackBar.open('Senha alterada!', 'OK', { duration: 10000 });
      //   });
      // }
      // this.dialogRef.close(true);
  }

  // cancel() {
  //   this.dialogRef.close(false);
  // }

  // change() {
  //   if (this.form.invalid)
  //     return;

  //   if (this.router.url.indexOf('servicos') !== -1)
  //     this.changePasswordService.changePasswordCooperated(this.form.get('currentPassword').value, this.form.get('passwords').get('new').value).then((data) => {
  //       if (data && data.status && data.status === 210)
  //         this.snackBar.open('Senha atual está errada!', 'OK', { duration: 10000 });
  //       else
  //         this.snackBar.open('Senha alterada!', 'OK', { duration: 10000 });
  //     });
  //   else if (this.router.url.indexOf('atendimento') !== -1)
  //     this.changePasswordService.changePasswordAdmin(this.form.get('currentPassword').value, this.form.get('passwords').get('new').value).then((data) => {
  //       if (data && data.status && data.status === 210)
  //         this.snackBar.open('Senha atual está errada!', 'OK', { duration: 10000 });
  //       else
  //         this.snackBar.open('Senha alterada!', 'OK', { duration: 10000 });
  //     });

  //   if (this.dialogRef.componentInstance.adminChangePassword) { // Quando o gestor for alterara senha de algum atendente
  //     this.changePasswordService.managerChangePassword(this.user.identifier, this.form.get('passwords').get('new').value).then((data) => {
  //       this.snackBar.open('Senha alterada!', 'OK', { duration: 10000 });
  //     });
  //   }
  //   this.dialogRef.close(true);
  // }
}
