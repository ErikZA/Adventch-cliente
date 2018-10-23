import { Subscription ,  of } from 'rxjs';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { AuthService } from './../../../../../shared/auth.service';
import { School } from '../../../../scholarship/models/school';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EModules, Module } from '../../../../../shared/models/modules.enum';
import { User } from '../../../../../shared/models/user.model';

import * as moment from 'moment';
import { StrongPasswordValidator } from '../../../../../core/components/password/strong-password.directive';
import { Profile } from '../../../models/profile/profile.model';
import { auth } from '../../../../../auth/auth';
import { UserDataComponent } from '../user-data/user-data.component';
import { AdministrationService } from '../../../administration.service';
import { MatSnackBar } from '@angular/material';
import { ScholarshipService } from '../../../../scholarship/scholarship.service';

import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { switchMap, tap, skipWhile, delay } from 'rxjs/operators';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
@AutoUnsubscribe()
export class UserFormComponent implements OnInit, OnDestroy {

  hideNew = true;
  dates: any;
  form: FormGroup;
  formProfiles: FormArray;

  user: User;
  profiles: Profile[] = [];
  schools: School[] = [];
  modules: EModules[] = [];
  // isSending = false;

  strength: number;
  valFn: ValidatorFn;     // the validation function
  user_inputs: string[] = ['foobar', 'barfoo'];
  level = '2';

  loading = true;
  sub1: Subscription;
  isSending = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private schoolarShipService: ScholarshipService,
    private authService: AuthService,
    private userDataComponent: UserDataComponent,
    private administraionService: AdministrationService,
    private snackBar: MatSnackBar
  ) {
    this.valFn = StrongPasswordValidator(this.level, this.user_inputs);
  }

  /*
    Inicialização
   */
  ngOnInit() {
    this.initConfiguratios();
    this.initForm();

    this.sub1 = this.loadSchools()
      .pipe(
        switchMap(() => this.loadProfiles()),
        switchMap(() => this.route.params),
        tap(({ id }) => this.loading = !!id),
        skipWhile(({ id }) => !id),
        switchMap(({ id }) => this.editUser(id)),
        delay(500)
      ).subscribe(() => this.loading = false);

    this.userDataComponent.openSidenav();
  }
  ngOnDestroy(): void {
    this.userDataComponent.closeSidenav();
  }
  private initConfiguratios(): void {
    this.modules = auth.getCurrentUnit().modules;
    this.dates = {
      now: new Date(new Date().setFullYear(new Date().getFullYear())),
      min: new Date(new Date().setFullYear(new Date().getFullYear() - 95)),
      max: new Date(new Date().setFullYear(new Date().getFullYear() - 18))
    };
    moment.locale('pt');
  }

  private loadSchools() {
    const scholarship = this.modules.some(module => module === EModules.Scholarship);
    if (scholarship) {
      return this.schoolarShipService.getSchools()
      .pipe(
          tap((data: School[]) => {
            this.schools = data;
          }, error => console.log('Could not load todos schools.'))
      );
    }
    return of(undefined);
  }

  private loadProfiles() {
    const { id } = auth.getCurrentUnit();
    return this.administraionService.getProfiles(id)
    .pipe(
      tap((data: Profile[]) => {
        this.profiles = data.sort((a, b) => a.name.localeCompare(b.name));
      }, err => console.log('Could not load todos profiles.'))
    );
  }

  public labelTitle(): string {
    return this.checkIsEdit() ? 'Editar Usuário' : 'Novo Usuário';
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(/[a-zA-Z0-9]/)]],
      email: [null, [Validators.required]],
      birthday: null,
      password: [null, [Validators.required, Validators.minLength(6), this.valFn]],
      isAdmin: [false],
      school: null
    });
    this.initFormProfiles();
  }

  private initFormProfiles(): void {
    this.formProfiles = this.formBuilder.array([]);
    const { modules } = auth.getCurrentUnit();
    this.modules = modules;
    if (!modules) { return; }
    modules.forEach(module => {
      this.formProfiles.push(this.profileModuleForm(module));
    });
  }

  private profileModuleForm(module: EModules): FormGroup {
    return this.formBuilder.group({
      id: null,
      module: module
    });
  }

  public enableSchoolSelected(module: EModules) {
    if (module === EModules.Scholarship) {
      const formProfileScholarship = this.formProfiles.controls.find(group => group.value.module === EModules.Scholarship);
      if (formProfileScholarship) {
        if (formProfileScholarship.value.id !== null && formProfileScholarship.value.id !== undefined) {
          this.setValidatorsRequiredSelectGeneric(this.form, 'school');
        } else {
          this.unsetValidatorsRequiredSelectGeneric(this.form, 'school');
        }
      }
    }
  }

  private setValidatorsRequiredSelectGeneric(group: FormGroup, field: string): void {
    group.controls[field].setValidators([Validators.required]);
    group.controls[field].enable();
    this.updateValidatorsRequiredSelectGeneric(group, field);
  }

  private unsetValidatorsRequiredSelectGeneric(group: FormGroup, field: string): void {
    group.controls[field].patchValue(null);
    group.controls[field].clearValidators();
    group.controls[field].disable();
    this.updateValidatorsRequiredSelectGeneric(group, field);
  }

  private updateValidatorsRequiredSelectGeneric(group: FormGroup, field: string): void {
    group.controls[field].updateValueAndValidity();
  }

  private editUser(id: number) {
    return this.administraionService.getUser(id, auth.getCurrentUnit().id)
    .pipe(
        tap(data => {
        this.user = data;
        this.setValuesUserEdit(data);
        this.setValuesUserProfiles(data.profiles);
      })
    );
  }

  private setValuesUserProfiles(profiles: Profile[]): void {
    if (!Array.isArray(profiles)) { return; }
    this.formProfiles.controls.forEach((control: FormGroup) => {
      const profile = profiles.find(data => data.software === control.value.module);
      if (profile) {
        control.patchValue({
          id: profile.id
        });
      }
    });
  }

  private setValuesUserEdit(user: User): void {
    this.form.setValue({
      name: user.name,
      email: user.email,
      birthday: user.birthday ? user.birthday : null,
      password: 'password_!change-now',
      isAdmin: user.isSysAdmin,
      school: user.idSchool
    });
  }
  private checkIsEdit(): boolean {
    return this.user !== undefined && this.user !== null;
  }

  public getModuleName(id) {
    return new Module(id).getModuleName();
  }

  private handleFail(err = null) {
    console.log(err);
    this.isSending = false;
    if (err.status === 409) {
      this.snackBar.open(err.error + ', tente novamente.', 'OK', { duration: 5000 });
    } else {
      this.snackBar.open('Erro ao salvar o usuário, tente novamente.', 'OK', { duration: 5000 });
    }
  }
  handleSuccess(userId: number) {
    if (userId === auth.getCurrentUser().id) {
      this.authService.renewUserToken();
    }
    this.isSending = false;
    this.snackBar.open('Usuário salvo com sucesso.', 'OK', { duration: 5000 });
    this.userDataComponent.closeSidenav();
  }
  public saveUser() {
    if (this.form.invalid) {
      return;
    }
    const userData = this.getUserData();
    this.isSending = true;
    of(userData.id)
      .pipe(
        switchMap(id => !!id ? this.administraionService.editUser(userData, id) : this.administraionService.saveUser(userData)),
        switchMap(() => this.userDataComponent.getData())
      ).subscribe(() => this.handleSuccess(userData.id), error => this.handleFail(error));
  }

  private getUserData(): any {
    const { id } = auth.getCurrentUnit();
    const arr = Array.isArray(this.formProfiles.value) ? Array.from<any>(this.formProfiles.value) : [];
    const validate = arr.filter(f => !!f.id).map(f => f.id);

    if (!id) {
      throw new Error('error on get unit id');
    }
    return {
      ...this.form.value,
      id: this.checkIsEdit() ? this.user.id : 0,
      unitId: id,
      profiles: validate
    };
  }

  public onStrength({ strength }) {
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
}
