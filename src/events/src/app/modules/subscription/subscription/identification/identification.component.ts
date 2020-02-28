import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { EventModel, FieldsModel } from 'src/app/models/event.model';

@Component({
  selector: 'app-identification',
  templateUrl: './identification.component.html',
  styleUrls: ['./identification.component.scss']
})
export class IdentificationComponent implements OnInit {

  @Input('formInformation') formInformation: FormGroup;

  public subscription$: Observable<any>;
  public fields: FieldsModel[] = [];

  constructor(
    private store: Store<any>,
  ) {
    this.subscription$ = store.select('subscription')
  }

  ngOnInit() {
    this.subscription$.subscribe((res: EventModel) => {
      this.fields = res.fields;
    })
  }

  get getItem() {
    return this.formInformation.controls.fieldResponses as FormArray;
  }

}
