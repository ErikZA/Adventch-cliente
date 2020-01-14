import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { takeWhile, distinctUntilChanged } from 'rxjs/operators';
import { AdministrationService } from './../../../../administration.service';
import { Feature } from '../../../../models/feature.model';
import { FeatureFormSendInterface } from '../../../../interfaces/feature-form-send-interface';
import { EditProfile } from '../../../../models/profile/edit-profile.model';

@Component({
  selector: 'app-tree-permission-form',
  templateUrl: './tree-permission-form.component.html',
  styleUrls: ['./tree-permission-form.component.scss']
})
export class TreePermissionFormComponent implements OnInit {

  @Input() module: number;
  @Input() profile: EditProfile;
  @Input() formSubmittedOnce = false;
  allFeatures: Feature[] = [];
  features: Feature[] = [];
  featuresSpecial: Feature[] = [];
  formSpecial: FormArray;
  featuresDataForm: FeatureFormSendInterface[];

  constructor(
    private administrationService: AdministrationService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.getFeaturesOfModule(this.module);
  }

  public getFeaturesOfModule(module: number): void {
    if (module === 0 || module === undefined || module === null) {
      this.resetFeaturesOfModule();
      return;
    }
    this.administrationService.getFeaturesBySoftware(module)
      .pipe(takeWhile(f => f !== null && f !== undefined), distinctUntilChanged())
      .subscribe(features => {
        this.module = module;
        this.allFeatures = features;
        this.featuresSpecial = features.filter(f => f.isSpecial);
        this.features = features.filter(f => !f.isSpecial);
        this.initDataForm();
        this.initFormSpecial();
      });
  }

  public getFeatures(): FeatureFormSendInterface[] {
    return this.featuresDataForm;
  }

  private initFormSpecial(): void {
    this.formSpecial = this.formBuilder.array([]);
    this.featuresSpecial.forEach(f => {
      this.formSpecial.push(this.newFormSpecial(f));
    });
  }

  private newFormSpecial(feature: Feature): FormGroup {
    return this.formBuilder.group({
      id: feature.id,
      name: feature.name,
      isActive: this.featuresDataForm.some(f => f.id === feature.id),
      permissions: []
    });
  }

  private checkFeatureSpecial(check, id): void {
    if (check.checked) {
      if (!this.featuresDataForm.some(f => f.id === id)) {
        this.featuresDataForm.push({
          id: id,
          permissions: []
        });
      }
    } else {
      if (this.featuresDataForm.some(f => f.id === id)) {
        console.log(this.featuresDataForm.findIndex(f => f.id === id));
        this.featuresDataForm.splice(this.featuresDataForm.findIndex(f => f.id === id), 1);
      }
    }
  }

  private initDataForm(): void {
    this.featuresDataForm = [];
    if (!this.profile) {
      return;
    }
    this.profile.features.forEach((feature: Feature) => {
      this.featuresDataForm.push({
        id: feature.id,
        permissions: Array.isArray(feature.permissions) ?
          feature.permissions.filter(p => p.isActive).map(permission => permission.id) : []
      });
    });
  }

  public changePermissionFeature(feature: FeatureFormSendInterface): void {
    if (this.featuresDataForm.some(f => f.id === feature.id)) {
      if (feature.permissions.length === 0) {
        this.featuresDataForm.splice(this.featuresDataForm.findIndex(f => f.id === feature.id), 1);
      } else {
        this.featuresDataForm[this.featuresDataForm.findIndex(f => f.id === feature.id)] = feature;
      }
    } else {
      if (feature.permissions.length !== 0) {
        this.featuresDataForm.push(feature);
      }
    }
  }

  private getFeatureEdit(feature: Feature): FeatureFormSendInterface {
    if (this.featuresDataForm.some(f => f.id === feature.id)) {
      return this.featuresDataForm.find(f => f.id === feature.id);
    } else {
      return null;
    }
  }

  public resetFeaturesOfModule(): void {
    this.formSpecial = this.formBuilder.array([]);
    this.allFeatures = [];
    this.features = [];
    this.featuresSpecial = [];
    this.featuresDataForm = [];
    this.module = 0;
  }

  private featuresNotSelected(): boolean {
    return this.featuresDataForm.length === 0 && this.formSubmittedOnce;
  }

}
