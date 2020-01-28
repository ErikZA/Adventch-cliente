import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EPaymentTypes } from 'src/app/shared/enums/payment-types.enum';

@Component({
  selector: 'app-registration-payment-form',
  templateUrl: './registration-payment-form.component.html',
  styleUrls: ['./registration-payment-form.component.scss']
})
export class RegistrationPaymentFormComponent implements OnInit {
  @Input() paymentForm: FormGroup;
  @Output() registerEmitted: EventEmitter<EPaymentTypes> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  public registerSubscription(paymentType: EPaymentTypes): void {
    this.registerEmitted.emit(paymentType);
  }

}
