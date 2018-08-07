import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { User } from '../../models/user.model';
import { ProfileStore } from '../profile.store';
import { AuthService } from '../../auth.service';

import * as moment from 'moment';
import { auth } from '../../../auth/auth';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  formUser: FormGroup;
  dates: any;
  user: User;
  loading: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private store: ProfileStore,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loading = false;
    this.initConfiguratios();
    this.getUser();
    this.store.user$.subscribe(data => {
      if (data) {
        this.user = data;
        this.initForm();
        this.loading = true;
      }
    });
  }

  private initConfiguratios(): void {
    this.dates = {
      now: new Date(new Date().setFullYear(new Date().getFullYear())),
      min: new Date(new Date().setFullYear(new Date().getFullYear() - 95)),
      max: new Date(new Date().setFullYear(new Date().getFullYear() - 18))
    };
    moment.locale('pt');
  }

  private getUser(): void {
    const { id } = auth.getCurrentUser();
    this.store.loadUser(id);
  }

  private initForm(): void {
    this.formUser = this.formBuilder.group({
      id: [this.user.id],
      name: [this.user.name, [Validators.required, Validators.min(3)]],
      email: [this.user.email, [Validators.required, Validators.email]],
      cpf: [this.user.cpf],
      birthday: [this.user.birthday],
    });
  }

  public saveUser(): void {
    const unitId = auth.getCurrentUser().idDefaultUnit;
    if (this.formUser.valid && !!unitId) {
      this.store.saveUser({
        ...this.formUser.value,
        unitId
      });
    }
  }

  public changeComponent(event: boolean): void {
    if (event) {
      this.router.navigate(['/alterar-senha']);
    }
  }
}
