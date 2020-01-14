import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { tap, skipWhile, switchMap, delay } from 'rxjs/operators';
import { EditProfile } from '../../../../models/profile/edit-profile.model';
import { EModules, Module } from '../../../../../../shared/models/modules.enum';
import { Feature } from '../../../../models/feature.model';
import { AuthService } from '../../../../../../shared/auth.service';
import { ProfileDataComponent } from '../../profile-data/profile-data.component';
import { auth } from '../../../../../../auth/auth';
import { FeatureFormSendInterface } from '../../../../interfaces/feature-form-send-interface';
import { TreePermissionFormComponent } from './../tree-permission-form/tree-permission-form.component';
import { MatSnackBar } from '@angular/material';
import { AdministrationService } from '../../../../administration.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
@AutoUnsubscribe()
export class ProfileFormComponent implements OnInit, OnDestroy {

  @ViewChild(TreePermissionFormComponent)
  treePermissionFormComponent: TreePermissionFormComponent;

  formProfile: FormGroup;
  formPermissions: FormArray;
  profile: EditProfile;
  loading = true;
  isSending = false;
  modules: EModules[];
  features$: Observable<Feature[]>;
  moduleSelected = false;
  formSubmittedOnce = false;
  features: FeatureFormSendInterface[];
  module = 0;
  sub1: Subscription;
  hasSaved = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private profileDataComponent: ProfileDataComponent,
    private admimistrationService: AdministrationService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getModulesUserUnit();
    this.initForm();
    this.sub1 = this.route.params
      .pipe(
        tap(({ id }) => this.loading = !!id),
        skipWhile(({ id }) => !id),
        switchMap(({ id }) => this.editProfile(id)),
        delay(500)
      ).subscribe(() => this.loading = false);
    this.profileDataComponent.openSidenav();
  }

  ngOnDestroy(): void {
    this.profileDataComponent.closeSidenav();
  }

  public labelTitle(): string {
    return this.checkIsEdit() ? 'Editar Papel' : 'Novo Papel';
  }

  private initForm(): void {
    this.formPermissions = this.formBuilder.array([]);
    this.formProfile = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(/[a-zA-Z0-9]/)]],
      software: ['', Validators.required],
    });
  }

  private checkIsEdit(): boolean {
    return this.profile !== undefined && this.profile !== null;
  }

  public getModulesUserUnit(): void {
    const { modules } = auth.getCurrentUnit();
    this.modules = modules;
  }

  public getModuleName(module: EModules): string {
    return new Module(module).getModuleName();
  }

  private editProfile(id: number) {
    return this.admimistrationService.getProfile(id)
    .pipe(
      tap((data: EditProfile) => {
        this.profile = data;
        this.module = this.profile.software;
        this.setValueProfileEdit();
      })
    );
  }

  private setValueProfileEdit(): void {
    if (this.profile) {
      this.formProfile.setValue({
        name: this.profile.name,
        software: this.profile.software
      });
    }
  }


  public saveProfile(): void {
    this.hasSaved = false;
    this.formSubmittedOnce = true;
    const profilesIds = auth.getCurrentDecodedToken().profiles.map(p => p.id);
    const renewToken = !!this.profile ? profilesIds.includes(this.profile.id) : false;
    if (this.formProfile.valid && this.getSelectedFeatures().length !== 0) {
      this.isSending = true;
      this.sendData()
        .pipe(
          switchMap(() => this.profileDataComponent.getData()),
          tap(() => this.profileDataComponent.closeSidenav()),
          tap(() => this.snackBar.open('Papel salvo com sucesso!', 'OK', { duration: 3000 })),
          tap(() => this.isSending = false),
          skipWhile(() => renewToken === false)
        ).subscribe(() => this.authService.renewUserToken(), () => {
        this.snackBar.open('Ocorreu um erro ao salvar o papel', 'OK', { duration: 3000 });
      });
    }
  }

  private getSelectedFeatures() {
    return this.treePermissionFormComponent.getFeatures();
  }

  private sendData() {
    const profile = this.formProfile.value;
    profile.features = this.getSelectedFeatures();
    //  Se editar não precisa enviar id da unidade
    profile.idUnit = auth.getCurrentUnit().id;

    return this.checkIsEdit() ?
        this.admimistrationService.putProfile(profile, this.profile.id) :
        this.admimistrationService.postProfile(profile);
  }

  public changeModuleOfProfile(module: EModules): void {
    if (module) {
      this.module = module;
      this.treePermissionFormComponent.getFeaturesOfModule(module);
    } else {
      this.treePermissionFormComponent.resetFeaturesOfModule();
    }
  }
}
