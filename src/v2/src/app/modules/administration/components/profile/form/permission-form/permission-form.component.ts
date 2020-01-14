import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Feature } from '../../../../models/feature.model';
import { FeatureFormSendInterface } from '../../../../interfaces/feature-form-send-interface';

@Component({
  selector: 'app-permission-form',
  templateUrl: './permission-form.component.html',
  styleUrls: ['./permission-form.component.scss']
})
export class PermissionFormComponent implements OnInit {

  @Input()
  feature: Feature;
  @Input()
  featureEdit: FeatureFormSendInterface;

  @Output()
  featureChange: EventEmitter<FeatureFormSendInterface> = new EventEmitter<FeatureFormSendInterface>();

  expanded = false;
  indeterminate = false;
  checked = false;
  featureChecked = false;
  formPermissions: FormGroup;
  formFeature: FormGroup;
  permissions: string[] = ['create', 'read', 'edit', 'delete'];
  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initForm();
    this.formFormFeature();
    this.formPermissionChanges();
    this.setValuesForm();
  }

  private initForm(): void {
    this.formPermissions = this.formBuilder.group({
      create: [null],
      read: [null],
      edit: [null],
      delete: [null]
    });
    this.formFeature = this.formBuilder.group({
      feature: null,
      permissions: this.formPermissions
    });
  }

  private setValuesForm(): void {
    if (!this.featureEdit) {
      return;
    }
    this.formPermissions.setValue({
      create: this.featureEdit.permissions.some(f => f === 1),
      read: this.featureEdit.permissions.some(f => f === 2),
      edit: this.featureEdit.permissions.some(f => f === 3),
      delete: this.featureEdit.permissions.some(f => f === 4)
    });
  }

  public getValuePermissions(): any {
    return this.formPermissions.value;
  }

  private formFormFeature(): void {
    this.formFeature.valueChanges.subscribe(value => {
      this.sendEventValuesForm(this.mapFormToDataSend(value));
    });
  }

  private mapFormToDataSend(value): FeatureFormSendInterface {
    const feature: FeatureFormSendInterface = {
      id: this.feature.id,
      permissions: this.mapFormPermissionsToDataSend(value.permissions)
    };
    return feature;
  }

  private mapFormPermissionsToDataSend(value): number[] {
    const permissions = [];
    this.permissions.forEach(p => {
      if (value[p]) {
        permissions.push(this.permissions.findIndex(_permission => p === _permission) + 1);
      }
    });
    return permissions;
  }

  private sendEventValuesForm(feature: FeatureFormSendInterface): void {
    this.featureChange.emit(feature);
  }

  private formPermissionChanges(): void {
    this.formPermissions.valueChanges.subscribe(value => {
      this.checkIfStateIsIndeterminate(value);
      this.checkIfFeatureIsChecked(value);
    });
  }

  private checkIfFeatureIsChecked(value: any): void {
    if (this.checkIfAllCheckedTrue(value)) {
      this.featureChecked = true;
      this.indeterminate = false;
    } else {
      this.featureChecked = false;
    }
    this.changeValueFeatureForm();
  }

  private changeValueFeatureForm() {
    this.formFeature.patchValue({
      feature: this.featureChecked
    });
  }

  private checkIfStateIsIndeterminate(value: any): void {
    if (this.checkIfAllCheckedTrue(value) && this.featureChecked) {
      this.indeterminate = false;
    } else if (this.checkIfAllCheckedFalse(value)) {
      this.indeterminate = false;
    } else if (!this.checkIfAllCheckedTrue(value)) {
      this.indeterminate = true;
    }
  }

  public changeCheckFeature(check): void {
    if (check.checked) {
      this.expanded = true;
      this.checkOrUncheckAllPermissions(true);
    } else {
      this.checkOrUncheckAllPermissions(false);
    }
    this.indeterminate = false;
  }

  private checkOrUncheckAllPermissions(value: boolean): void {
    this.formPermissions.setValue({
      create: value,
      read: value,
      edit: value,
      delete: value
    });
  }

  public expandedPermissions(): void {
    this.expanded = !this.expanded;
  }

  private checkIfAllCheckedTrue(value: any): boolean {
    return value.create === true
      && value.read === true
      && value.edit === true
      && value.delete === true;
  }

  private checkIfAllCheckedFalse(value: any): boolean {
    return value.create === false
      && value.read === false
      && value.edit === false
      && value.delete === false;
  }
}
