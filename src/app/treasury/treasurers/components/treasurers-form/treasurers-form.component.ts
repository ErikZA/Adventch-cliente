import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-treasurers-form',
  templateUrl: './treasurers-form.component.html',
  styleUrls: ['./treasurers-form.component.scss']
})
export class TreasurersFormComponent implements OnInit {
  formTreasurer: FormGroup;
  formPersonal: FormGroup;
  formContact: FormGroup;
  formBusiness: FormGroup;

  roles = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.formPersonal = this.formBuilder.group({
      name: [null, Validators.required],
      cpf: [null],
      birthday: [null],
      gender: [null]
    });
    this.formContact = this.formBuilder.group({
      email: [null],
      phone: [null],
      address: [null],
      cep: [null],
    });
    this.formBusiness = this.formBuilder.group({
      church: [null, Validators.required],
      role: [null, Validators.required],
      registrationDate: [null]
    });
    this.formTreasurer = this.formBuilder.group({
      personal: this.formPersonal,
      business: this.formBusiness,
      preferentialContact: [null],
      complement: [null]
    });
  }

}
