import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {
  identificationForm: FormGroup;
  paymentForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.identificationForm = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      cpf: [null, Validators.required],
      phone: [null],
    });
    this.paymentForm = this.formBuilder.group({
      number: [null, Validators.required],
      expirationDate: [null, Validators.required],
      name: [null, Validators.required],
      ccv: [null, Validators.required]
    });
  }

}
