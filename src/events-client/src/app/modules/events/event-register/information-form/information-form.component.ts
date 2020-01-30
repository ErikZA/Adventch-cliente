import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AddInformation } from '../../../../actions/newEvent.action';

@Component({
  selector: 'app-information-form',
  templateUrl: './information-form.component.html',
  styleUrls: ['./information-form.component.scss']
})
export class InformationFormComponent implements OnInit {

  @Input('formInformation') formInformation: FormGroup;

  public information$: Observable<any>;

  constructor(
    public store: Store<any>,
  ) {
  }

  ngOnInit() {
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
