import { ProfileStore } from '../../profile/profile.store';
import { School } from '../../../../scholarship/models/school';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { UserStore } from '../user.store';
import { AuthService } from '../../../../../shared/auth.service';

import { Role } from '../../../models/role.model';
import { EModules, Module } from '../../../../../shared/models/modules.enum';
import { User } from '../../../../../shared/models/user.model';
import { SidenavService } from '../../../../../core/services/sidenav.service';

import * as moment from 'moment';
import { StrongPasswordValidator } from '../../../../../core/components/password/strong-password.directive';
import { ProcessesStore } from '../../../../scholarship/components/process/processes.store';
import { Profile } from '../../../models/profile/profile.model';
import { auth } from '../../../../../auth/auth';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  hideNew = true;
  dates: any;
  form: FormGroup;
  formProfiles: FormArray;

  user: User;
  profiles$: Observable<Profile[]>;
  schools$: Observable<School[]>;
  modules: EModules[];
  loading: boolean;
  isSending = false;

  strength: number;
  valFn: ValidatorFn;     // the validation function

  user_inputs: string[] = ['foobar', 'barfoo'];
  level = '2';

  constructor(
    private formBuilder: FormBuilder,
    private store: UserStore,
    private authService: AuthService,
    private route: ActivatedRoute,
    private sidenavService: SidenavService,
    private profileStore: ProfileStore,
    private schoolarshipStore: ProcessesStore
  ) {
    this.valFn = StrongPasswordValidator(this.level, this.user_inputs);
  }

  /*
    Inicialização
   */
  ngOnInit() {
    this.loading = false;
    this.initConfiguratios();
    this.loadAllDatas();
    this.initForm();
    this.route.params.pipe(map(({ idUser }) => idUser)).subscribe(id => {
      if (id) {
        this.store.loadUser(id).subscribe(user => {
          this.user = user;
          if (this.user) {
            this.editUser();
            // this.setValidatorsSelectsProfiles();
          }
        });
      } else {
        // this.setValidatorsSelectsProfiles();
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

  public loadAllDatas(): void {
    const { modules } = auth.getCurrentUnit();
    this.modules = modules;
    this.loadSchools();
    this.loadProfiles();
  }

  private loadSchools(): void {
    if (this.modules) {
      const scholarship = this.modules.some(module => module === EModules.Scholarship);
      if (scholarship) {
        this.schools$ = this.schoolarshipStore.schools$;
        this.schoolarshipStore.loadSchools();
      }
    }
  }

  private loadProfiles(): void {
    this.profiles$ = this.profileStore.profiles$;
    this.profileStore.loadAllProfiles();
  }

  public labelTitle(): string {
    return this.checkIsEdit() ? 'Editar' : 'Novo';
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
    console.log(module);
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

  private setValidatorsSelectsProfiles(): void {
    if (!this.formProfiles.controls || this.formProfiles.controls === undefined || this.formProfiles.controls === null) {
      return;
    }
    const formProfileScholarship = this.formProfiles.controls.find(group => group.value.module === EModules.Scholarship);
    if (formProfileScholarship) {
      if (formProfileScholarship.value.id !== null && formProfileScholarship.value.id !== undefined) {
        this.setValidatorsRequiredSelectGeneric(this.form, 'school');
      } else {
        this.unsetValidatorsRequiredSelectGeneric(this.form, 'school');
      }
    }
    // this.formProfiles.controls.forEach((group: FormGroup) => {
    //   // if (group.value.access && group.value.module !== EModules.Scholarship) {
    //   //   this.setValidatorsRequiredSelectGeneric(group, 'id');
    //   // } else if (!group.value.access && group.value.module !== EModules.Scholarship) {
    //   //   this.unsetValidatorsRequiredSelectGeneric(group, 'id');
    //   // } else

    //   if (group.value.id !== null && group.value.id !== undefined && group.value.module === EModules.Scholarship) {
    //     // this.setValidatorsRequiredSelectGeneric(group, 'id');
    //     this.setValidatorsRequiredSelectGeneric(this.form, 'school');
    //   } else if ((group.value.id === null || group.value.id === undefined) && group.value.module === EModules.Scholarship) {
    //     // this.unsetValidatorsRequiredSelectGeneric(group, 'id');
    //     this.unsetValidatorsRequiredSelectGeneric(this.form, 'school');
    //   }
    // });
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

  private editUser(): void {
    this.setValuesUserEdit();
    this.setValuesUserProfiles();
    this.loading = true;
  }

  private setValuesUserProfiles(): void {
    const { profiles } = this.user;
    if (!profiles) { return; }
    this.formProfiles.controls.forEach((control: FormGroup) => {
      const profile = profiles.find(data => data.software === control.value.module);
      if (profile) {
        control.patchValue({
          id: profile.id
        });
      }
    });
  }

  private setValuesUserEdit(): void {
    this.form.setValue({
      name: this.user.name,
      email: this.user.email,
      birthday: this.user.birthday ? this.user.birthday : null,
      password: 'password_!change-now',
      isAdmin: this.user.isSysAdmin,
      school: this.user.idSchool
    });
  }

  public closeSidenav(): void {
    this.sidenavService.close();
  }

  private checkIsEdit(): boolean {
    return this.user !== undefined && this.user !== null;
  }

  public getModuleName(id) {
    return new Module(id).getModuleName();
  }

  public saveUser() {
    this.isSending = true;
    const user = this.setUserData();
    if (this.form.valid) {
      this.store.saveUser(user);
    }
    this.isSending = false;
  }

  private setUserData(): any {
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
}
