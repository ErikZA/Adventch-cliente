import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  @Input('typePayment') typePayment: string;

  constructor() { }

  ngOnInit() {
  }

}
