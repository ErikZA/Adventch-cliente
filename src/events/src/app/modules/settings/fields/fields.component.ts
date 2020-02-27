import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material';

import { SettingService } from '../setting.service';
import { FieldModel } from 'src/app/models/fields.model';
import { FieldsService } from './fields.service';
import { FieldFormComponent } from './field-form/field-form.component';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss']
})
export class FieldsComponent implements OnInit {

  public field$: Observable<FieldModel>;
  public fields: FieldModel[] = [];

  constructor(
    public setting: SettingService,
    private field: FieldsService,
    private dialog: MatDialog,
    private store: Store<any>,
  ) {
    this.field$ = store.select('field')
  }

  ngOnInit() {
    this.field.All();
    this.field$.subscribe((res: any) => this.fields = res.data);
  }

  OpenDialogFields() {
    this.dialog.open(FieldFormComponent, {
      width: '300'
    })
  }

  UpdateOpenDialogFields(id: string) {
    this.dialog.open(FieldFormComponent, {
      width: '300',
      data: { id }
    })
  }

  removeField(index: string) {
    this.field.Remove(index);
  }
}
