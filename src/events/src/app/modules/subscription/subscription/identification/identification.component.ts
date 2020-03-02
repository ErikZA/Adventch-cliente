import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { EventModel, FieldsModel, FieldsModel2 } from 'src/app/models/event.model';
import { MatInput } from '@angular/material';

@Component({
  selector: 'app-identification',
  templateUrl: './identification.component.html',
  styleUrls: ['./identification.component.scss']
})
export class IdentificationComponent implements OnInit {

  @Input('formInformation') formInformation: FormGroup;

  @Output() emitterEvent: EventEmitter<any> = new EventEmitter();

  public subscription$: Observable<any>;
  public fields: FieldsModel[] = [];
  public fieldResponses: {
    fieldId: string,
    fieldType: number,
    value: string
  }[] = [];

  constructor(
    private store: Store<any>,
  ) {
    this.subscription$ = store.select('subscription')
  }

  ngOnInit() {
    this.subscription$.subscribe((res: EventModel) => {
      this.fields = res.fields;

      if (this.fields !== undefined) {
        this.fields.map((f) => {
          const { id, fieldTypeId } = f;
          this.fieldResponses.push({ fieldId: id, fieldType: fieldTypeId, value: "" })
        })
      }
    })
  }

  setValue(id: any, value: any) {
    this.fieldResponses.forEach((item, index) => {
      if (item.fieldId === id) {
        this.fieldResponses[index].value = value;
      }
    })
  }

  eventEmmiter() {
    this.emitterEvent.emit(this.fieldResponses);
  }

  get getItem() {
    return this.formInformation.controls.fieldResponses as FormArray;
  }

}
