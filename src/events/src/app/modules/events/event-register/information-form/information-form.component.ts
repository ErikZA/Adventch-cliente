import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AddInformation } from '../../../../actions/newEvent.action';
import { ReadFields } from '../../../../actions/field.action';
import { FieldModel } from 'src/app/models/fields.model';
import { FieldsService } from 'src/app/modules/settings/fields/fields.service';

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
    private field: FieldsService
  ) {
    this.field$ = store.select('field')
  }
  
  ngOnInit() {
    this.field.All()
    this.field$.subscribe((res: any) => {
      this.fields = res.data
      console.log(res);
    });
  }

  sendInformation() {
    this.store.dispatch(AddInformation(
      this.formInformation.controls["name"].value,
      this.formInformation.controls["description"].value,
      this.formInformation.controls["subscriptionLimit"].value,
      this.formInformation.controls["realizationDate"].value,
      this.formInformation.controls["registrationDate"].value,
    ));
  }

}
