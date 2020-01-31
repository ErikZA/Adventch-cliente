import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss']
})
export class FieldsComponent implements OnInit {

  public formFields: FormGroup;

  constructor(
    public fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.formFields = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      isRequired: [''],
      fieldTypeId: ['', Validators.required],
    })
  }

}
