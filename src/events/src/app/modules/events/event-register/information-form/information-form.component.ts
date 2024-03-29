import { Component, OnInit, Input, } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { FieldModel } from 'src/app/models/fields.model';
import { FieldsService } from 'src/app/modules/settings/fields/fields.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-information-form',
  templateUrl: './information-form.component.html',
  styleUrls: ['./information-form.component.scss']
})
export class InformationFormComponent implements OnInit {

  @Input('formInformation') formInformation: FormGroup;

  public field$: Observable<any>;
  public fields: FieldModel[];

  constructor(
    public store: Store<any>,
    private field: FieldsService,
    public datePipe: DatePipe
  ) {
    this.field$ = store.select('field')
  }

  ngOnInit() {
    this.field.All()
    this.field$.subscribe((res: any) => this.fields = res.data);
  }

}
