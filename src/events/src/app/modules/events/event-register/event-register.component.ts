import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-register',
  templateUrl: './event-register.component.html',
  styleUrls: ['./event-register.component.scss']
})
export class EventRegisterComponent implements OnInit {

  public isLinear = true;

  // Forms
  public formInformation: FormGroup;
  public formCoupon: FormGroup;
  public formProduct: FormGroup;
  public formAdrees: FormGroup;
  public formPayments: FormGroup;

  constructor(
    public fb: FormBuilder
  ) { }

  ngOnInit() {

    this.formInformation = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      subscriptionLimit: ['', Validators.compose([Validators.required, Validators.min(1), Validators.minLength(1)])],
      realizationDate: ['', Validators.required],
      registrationDate: ['', Validators.required],
    });

    this.formCoupon = this.fb.group({
      name: ['', Validators.required],
      percentage: ['', Validators.compose([Validators.required, Validators.min(1), Validators.minLength(1), Validators.max(100)])],
      usageLimit: ['', Validators.compose([Validators.required, Validators.min(1), Validators.minLength(1)])]
    })

    this.formProduct = this.fb.group({
      name: ['', Validators.required],
      value: ['', Validators.compose([Validators.required, Validators.min(1), Validators.minLength(1)])]
    })

    this.formAdrees = this.fb.group({
      cep: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      street: ['', Validators.required],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      uf: ['', Validators.required],
      complement: [''],
      number: [''],
    })

    this.formPayments = this.fb.group({
      cashValue: ['', Validators.compose([Validators.required, Validators.min(1)])],
      installmentAmount: ['', Validators.compose([Validators.required, Validators.min(1)])],
      installmentLimit: ['', Validators.compose([Validators.required, Validators.min(1)])],
      bankAccountId: ['', Validators.required]
    })

  }

}
