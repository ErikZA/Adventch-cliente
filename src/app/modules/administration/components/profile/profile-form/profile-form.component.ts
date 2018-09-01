import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';

import 'rxjs/operator/do';

import { AuthService } from '../../../../../shared/auth.service';

import { NewProfile } from '../../../models/profile/new-profile.model';
import { EditProfile } from '../../../models/profile/edit-profile.model';
import { Feature } from '../../../models/feature.model';
import { EModules, Module } from '../../../../../shared/models/modules.enum';
import { EPermissions } from '../../../../../shared/models/permissions.enum';
import { Permission } from '../../../../../shared/models/permission.model';
import { auth } from '../../../../../auth/auth';
import { ProfileDataComponent } from '../profile-data/profile-data.component';
import { AdministrationService } from '../../../administration.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit, OnDestroy {


  formProfile: FormGroup;
  formPermissions: FormArray;
  profile: EditProfile;
  loading: boolean;
  isSending = false;
  modules: EModules[] = [];
  features: Feature[] = [];
  moduleSelected = false;
  formSubmittedOnce = false;

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
    this.route.params.subscribe(params => {
        const id = parseInt(params.idProfile, 10);
        if (!Number.isInteger(id)) {
          return;
        }
        this.editProfile(id);
      });
    this.profileDataComponent.sidenavRight.open();
  }
  ngOnDestroy(): void {
    this.profileDataComponent.closeSidenav();
  }
  public labelTitle(): string {
    return this.checkIsEdit() ? 'Editar' : 'Novo';
  }

  private initForm(): void {
    this.formPermissions = this.formBuilder.array([]);
    this.formProfile = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(/[a-zA-Z0-9]/)]],
      software: [null, Validators.required],
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

  public getPermissionName(permission: EPermissions): string {
    return new Permission(permission).getPermissionName();
  }

  private getFormFeaturesSoftwares(software: EModules): void {
    this.formPermissions = this.formBuilder.array([]);
    this.admimistrationService.getFeaturesBySoftware(software).subscribe((features: Feature[]) => {
      if (Array.isArray(features)) {
        this.features = features;
        this.formPermissions = this.formBuilder.array([]);
        let form: FormArray;
        form = this.formBuilder.array([]);
        let formFeature: FormGroup;
        features.forEach(f => {
          formFeature = this.formBuilder.group({});
          formFeature.addControl('id', new FormControl(f.id));
          formFeature.addControl('name', new FormControl(f.name));
          formFeature.addControl(
            'isActive',
            new FormControl(this.checkIsEdit() ? this.checkFeatureIsActive(f.id) : false));
          if (!f.isSpecial) {
            formFeature.addControl('permissions', this.getFormPermissionsFeature(f.permissions, f.id));
          }
          formFeature.addControl('isSpecial', new FormControl(f.isSpecial));
          form.push(formFeature);
        });
        this.formPermissions = form;
      }
    });
  }

  private getFeatureProfile(featureId: number): Feature {
    if (this.profile.features === undefined || this.profile.features === null || this.profile.features.length === 0) {
      return null;
    }
    return this.profile.features.find(f => f.id === featureId);
  }

  private checkFeatureIsActive(featureId: number): boolean {
    const feature = this.getFeatureProfile(featureId);
    return feature !== undefined && feature !== null ? true : false;
  }

  private getFormPermissionsFeature(permissions: Permission[], featureId: number): FormArray {
    let form: FormArray;
    form = this.formBuilder.array([]);
    if (permissions) {
      let formPermissionsFeatures: FormGroup;
      for (let i = 0; i < permissions.length; i++) {
        const p = permissions[i];
        formPermissionsFeatures = this.formBuilder.group({});
        formPermissionsFeatures.addControl('id', new FormControl(p.id));
        formPermissionsFeatures.addControl('name', new FormControl(p.name));
          formPermissionsFeatures.addControl(
            'isActive',
            new FormControl(this.checkIsEdit() ? this.checkPermissionIsActive(p.id, featureId) : false));
        form.push(formPermissionsFeatures);
      }
    }
    return form;
  }

  private checkPermissionIsActive(permissionId: number, featureId: number): boolean {
    const feature = this.getFeatureProfile(featureId);
    if (feature === undefined || feature === null) {
      return false;
    }
    if (feature.permissions === undefined || feature.permissions === null || feature.permissions.length === 0) {
      return false;
    }
    const permission = feature.permissions.find(f => f.id === permissionId);
    // console.log(permission);

    return permission !== undefined && permission !== null && permission.isActive ? permission.isActive : false;
  }

  private editProfile(id: number): void {
    this.admimistrationService.getProfile(id).subscribe((data: EditProfile) => {
      console.log(data);
      this.profile = data;
      this.getFormFeaturesSoftwares(data.software);
      this.setValueProfileEdit();
    });
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
    this.isSending = true;
    this.formSubmittedOnce = true;
    if (this.formProfile.valid && this.checkIfHaveMarkedFeatureAndPermission()) {
      this.sendData().subscribe(() => {
        this.authService.renewUserToken();
        this.profileDataComponent.closeSidenav();
        this.profileDataComponent.getData();
        this.snackBar.open('Papel salvo com sucesso!', 'OK', { duration: 3000 });
      });
    }
    this.isSending = false;
  }

  private checkIfHaveMarkedFeatureAndPermission(): boolean {
    const features = this.formPermissions.value;
    if (!features) {
      return false;
    }
    let havePermission;
    haveCheckMarked:
    for (const feature of features) {
      if (feature.isActive && feature.isSpecial) {
        havePermission = true;
        break haveCheckMarked;
      } else if (feature.isActive && !feature.isSpecial) {
        for (const permission of feature.permissions) {
          if (permission.isActive) {
            havePermission = true;
            break haveCheckMarked;
          }
        }
      }
    }
    return havePermission ? havePermission : false;
  }
  private getSelectedFeatures() {
    const ar = Array.isArray(this.formPermissions.value) ? Array.from<Feature>(this.formPermissions.value) : [];
    const f = ar.filter(ft => ft.isActive);
    return f.map(feature => {
        return {
          id: feature.id,
          permissions: Array.isArray(feature.permissions) ?
          feature.permissions.filter(p => p.isActive).map(permission => permission.id) : []
        };
    });
  }


  private sendData() {
    if (this.checkIsEdit()) {
      const profile = this.formProfile.value as EditProfile;
      profile.id = this.profile.id;
      profile.features = this.getSelectedFeatures();
      return this.admimistrationService.putProfile(profile);
    } else {
      const { id } = auth.getCurrentUnit();
      const profile = this.formProfile.value as NewProfile;
      profile.idUnit = id;
      profile.features = this.getSelectedFeatures();
      return this.admimistrationService.postProfile(profile);
    }
  }

  public changeCheckFeature(check: boolean, formFeature: FormArray): void {
    this.setCheckedAllPermissions(formFeature.controls, check);
  }


  public setCheckedAllPermissions(forms: AbstractControl[], value: boolean): void {
    forms.forEach(form => {
      form.patchValue({isActive: value});
    });
  }

  public changeCheckPermissions(check: boolean, formFeature: FormControl): void {
    if (check) {
      formFeature.patchValue({isActive: true});
    }
  }

  public changeModuleOfProfile(module: EModules): void {
    if (module) {
      this.getFormFeaturesSoftwares(module);
    }
  }
}
