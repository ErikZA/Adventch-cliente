import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, ValidatorFn, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { MatSnackBar } from '@angular/material';

import { SharedService } from '../shared.service';
import { StrongPasswordValidator } from '../../core/components/password/strong-password.directive';
import { auth } from '../../auth/auth';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@Component({
  selector: 'app-redefine-password',
  templateUrl: './redefine-password.component.html',
  styleUrls: ['./redefine-password.component.scss']
})
@AutoUnsubscribe()
export class RedefinePasswordComponent implements OnInit, OnDestroy {

  hideNew = true;
  hideConfirm = true;
  formPassword: FormGroup;
  strength: number;
  valFn: ValidatorFn;     // the validation function

  user_inputs: string[] = ['foobar', 'barfoo'];
  level = '2';

  subsRoute: Subscription;

  private token: string;

  constructor(
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.valFn = StrongPasswordValidator(this.level, this.user_inputs);
  }
  ngOnInit() {
    this.initForm();
  }

  ngOnDestroy(): void {

  }

  private initForm(): void {
    this.formPassword =  this.fb.group({
        new: [null, [Validators.required, Validators.minLength(6), this.valFn]],
        confirm: [null, [Validators.required]]
      }, {
        validator: this.matchingPasswords('new', 'confirm')
      });
    this.subsRoute = this.route.params.subscribe(token => {
      this.token = token.recover_pass;
    });
  }

  private matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];
      if (password.value !== confirmPassword.value) {
        return { mismatchedPasswords: true };
      }
    };
  }

  public onStrength({strength}) {
    this.strength = strength;
  }

  public getMensage(): string {
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

  public onSubmit(): void {
    if (this.formPassword.valid) {
      const data = this.setDataPassword();
      this.sharedService
      .passwordReset(data)
      .subscribe((res) => {
          this.snackBar.open('Senha alterada! Agora, utilize a nova senha para acessar o sistema', 'OK', { duration: 10000 });
          this.router.navigate(['/login']);
          auth.logoffMain();
      }, err => {
        console.log(err);
        this.snackBar.open('Error ao resetar a senha, tente novamente.', 'OK', { duration: 10000 });
      });
    }
  }

  private setDataPassword(): any {
    return {
      password: this.formPassword.value.new,
      token: this.token,
    };
  }
}
