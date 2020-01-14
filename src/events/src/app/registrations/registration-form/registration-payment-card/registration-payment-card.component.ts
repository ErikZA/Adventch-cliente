import { Component, OnInit, Input } from '@angular/core';
import CreditCard from '../../shared/models/credit-card.model';

@Component({
  selector: 'app-registration-payment-card',
  templateUrl: './registration-payment-card.component.html',
  styleUrls: ['./registration-payment-card.component.scss']
})
export class RegistrationPaymentCardComponent implements OnInit {

  @Input() card: CreditCard;
  @Input() frontCard = true;
  constructor() { }

  ngOnInit() {
  }

}
