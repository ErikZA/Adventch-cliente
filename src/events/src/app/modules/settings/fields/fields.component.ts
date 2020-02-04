import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { SettingService } from '../setting.service';
import { FieldTypeModel } from 'src/app/models/fieldTypes.model';
import { FieldModel } from 'src/app/models/fields.model';

import { ReadFields, AddField, RemoveField } from '../../../actions/field.action';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss']
})
export class FieldsComponent implements OnInit {

  public field: Observable<FieldModel>;
  public fields: FieldModel[] = [];

  public formFields: FormGroup;
  public fieldTypes: FieldTypeModel[] = [];

  constructor(
    public fb: FormBuilder,
    public setting: SettingService,
    private store: Store<any>,
  ) {
    this.field = store.select('field')
    this.store.dispatch(ReadFields());
  }

  ngOnInit() {

    this.formFields = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      guidingText: [''],
      isRequired: [''],
      fieldTypeId: ['', Validators.required],
    })

    this.field.subscribe((res: any) => this.fields = res.data);
    this.setting.getFieldTypes().then((res: any) => this.fieldTypes = res.data);

  }

  addField() {
    this.store.dispatch(AddField(
      this.formFields,
      this.formFields.controls["name"].value,
      this.formFields.controls["description"].value,
      this.formFields.controls["guidingText"].value,
      this.formFields.controls["isRequired"].value,
      this.formFields.controls["fieldTypeId"].value,
    ));
  }

  removeField(index: number) {
    this.store.dispatch(RemoveField(index));
  }

}
