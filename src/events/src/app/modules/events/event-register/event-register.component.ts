import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { EventRegisterService } from './event-register.service';
import { EventResponseModel } from 'src/app/models/event.model';
import { coupons } from '../../../actions/coupon.action';
import { produts } from '../../../actions/products.action';

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
    public fb: FormBuilder,
    private event: EventRegisterService,
    public datePipe: DatePipe
  ) {
  }

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
      state: ['', Validators.required],
      complement: [''],
      number: [''],
    })

    this.formPayments = this.fb.group({
      cashValue: ['', Validators.compose([Validators.required, Validators.min(1)])],
      installmentAmount: ['', Validators.compose([Validators.required, Validators.min(1)])],
      installmentLimit: ['', Validators.compose([Validators.required, Validators.min(1)])],
      bankAccountId: ['', Validators.required],
      paymentType: ['', Validators.required]
    })

  }

  createEvents() {
    const { name, description, subscriptionLimit, realizationDate, registrationDate } = this.formInformation.value;
    const { cashValue, installmentAmount, installmentLimit, bankAccountId, paymentType } = this.formPayments.value
    const realization = {
      begin: this.datePipe.transform(realizationDate[0], 'yyyy/MM/dd h:mm:ss'),
      end: this.datePipe.transform(realizationDate[1], 'yyyy/MM/dd h:mm:ss'),
    };
    const registration = {
      begin: this.datePipe.transform(registrationDate[0], 'yyyy/MM/dd h:mm:ss'),
      end: this.datePipe.transform(registrationDate[0], 'yyyy/MM/dd h:mm:ss')
    };

    let eventForm: EventResponseModel = new EventResponseModel(
      name,
      description,
      subscriptionLimit,
      realization,
      registration,
      cashValue,
      installmentAmount,
      installmentLimit,
      bankAccountId,
      paymentType,
      { ...this.formAdrees.value },
      coupons,
      produts
    );
    console.log(eventForm);
    this.event.Create(eventForm)
  }

}
