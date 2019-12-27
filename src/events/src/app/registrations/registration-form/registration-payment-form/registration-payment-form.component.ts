import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-registration-payment-form',
  templateUrl: './registration-payment-form.component.html',
  styleUrls: ['./registration-payment-form.component.scss']
})
export class RegistrationPaymentFormComponent implements OnInit {
  @Input() paymentForm: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
