import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FieldsService } from '../fields.service';
import { SettingService } from '../../setting.service';
import { FieldTypeModel } from 'src/app/models/fieldTypes.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ListService } from '../../list/list.service';
import { List } from 'src/app/models/list.model';

@Component({
  selector: 'app-field-form',
  templateUrl: './field-form.component.html',
  styleUrls: ['./field-form.component.scss']
})
export class FieldFormComponent implements OnInit {

  public list$: Observable<any>;

  public formFields: FormGroup;
  public fieldTypes: FieldTypeModel[] = [];
  public filedType: string;

  public id: string;
  public isEdit = false;
  public lists: List[] = [];

  constructor(
    public dialogRef: MatDialogRef<FieldFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder,
    public setting: SettingService,
    private field: FieldsService,
    private store: Store<any>,
    private list: ListService,
  ) {
    this.list$ = store.select('list')
  }

  ngOnInit() {

    this.formFields = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      guidingText: [''],
      isRequired: [''],
      fieldTypeId: ['', Validators.required],
      fieldListId: ['']
    })

    this.list.All()
    this.list$.subscribe(res => this.lists = res);
    this.setting.getFieldTypes().subscribe((res: any) => this.fieldTypes = res.data)


    if (this.data !== null && this.data !== undefined) {
      this.isEdit = true;
      this.id = this.data.id;
      this.field.One(this.data.id).subscribe((res: any) => {
        const { name, description, guidingText, isRequired, fieldTypeId, fieldListId } = res.data[0]
        this.formFields.controls["name"].setValue(name);
        this.formFields.controls["description"].setValue(description);
        this.formFields.controls["guidingText"].setValue(guidingText);
        this.formFields.controls["isRequired"].setValue(isRequired);
        this.formFields.controls["fieldTypeId"].setValue(fieldTypeId);
        this.formFields.controls["fieldListId"].setValue(fieldListId);
      })
    }


  }

  CreateField() {
    const { name, description, guidingText, isRequired, fieldTypeId, fieldListId } = this.formFields.value;
    this.field.Create(this.dialogRef, this.formFields, name, description, guidingText, isRequired, fieldTypeId, fieldListId)
  }

  UpdateField() {
    const { name, description, guidingText, isRequired, fieldTypeId, fieldListId } = this.formFields.value;
    this.field.Update(this.dialogRef, this.formFields, this.id, name, description, guidingText, isRequired, fieldTypeId, fieldListId)
  }

}
