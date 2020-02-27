import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { SettingService } from '../setting.service';
import { FieldTypeModel } from 'src/app/models/fieldTypes.model';
import { FieldModel } from 'src/app/models/fields.model';

import { ReadFields, AddField, RemoveField } from '../../../actions/field.action';
import { FieldsService } from './fields.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss']
})
export class FieldsComponent implements OnInit {

  public formFields: FormGroup;

  public field$: Observable<FieldModel>;
  public fields: FieldModel[] = [];
  public fieldTypes: FieldTypeModel[] = [];

  public isEdit = false;
  public idEdit: string;

  constructor(
    public fb: FormBuilder,
    public setting: SettingService,
    private store: Store<any>,
    private field: FieldsService,
    private activedRouter: ActivatedRoute,
    private router: Router
  ) {
    this.field$ = store.select('field')
  }

  ngOnInit() {

    this.formFields = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      guidingText: [''],
      isRequired: [''],
      fieldTypeId: ['', Validators.required],
    })

    this.field.All();
    this.field$.subscribe((res: any) => this.fields = res);
    this.setting.getFieldTypes().subscribe((res: any) => this.fieldTypes = res.data)

    this.activedRouter.queryParams.subscribe(res => {
      if (res.id !== null && res.id !== undefined) {
        this.isEdit = true;
        this.idEdit = res.id;
        this.field.One(res.id).subscribe((res: any) => {
          const { name, description, guidingText, isRequired, fieldTypeId } = res.data[0]
          this.formFields.controls["name"].setValue(name);
          this.formFields.controls["description"].setValue(description);
          this.formFields.controls["guidingText"].setValue(guidingText);
          this.formFields.controls["isRequired"].setValue(isRequired);
          this.formFields.controls["fieldTypeId"].setValue(fieldTypeId);
        })
      }
    })

  }

  addField() {
    const { name, description, guidingText, isRequired, fieldTypeId } = this.formFields.value;
    this.field.Create(this.formFields, name, description, guidingText, isRequired, fieldTypeId, "")
  }

  removeField(index: string) {
    this.field.Remove(index);
  }

  updateField() {
    const { name, description, guidingText, isRequired, fieldTypeId } = this.formFields.value;
    this.field.Update(this.formFields, this.idEdit, name, description, guidingText, isRequired, fieldTypeId)
    this.router.navigate(['/configuracoes/campos'], { queryParams: {} })
  }

  cleanFormEdit() {
    this.isEdit = false;
    this.formFields.reset();
    this.router.navigate(['/configuracoes/campos'], { queryParams: {} })
  }

}
