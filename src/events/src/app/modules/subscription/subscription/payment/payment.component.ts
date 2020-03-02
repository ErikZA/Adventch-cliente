import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observer, Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  @Input() formBillet: FormGroup;
  @Input() formcreditCard: FormGroup;

  @Output() methodPayment: EventEmitter<any> = new EventEmitter();

  public payment$: Observable<any>;
  public typePayment: number;

  constructor(
    private store: Store<any>,
  ) {
    this.payment$ = store.select('subscription')
  }

  ngOnInit() {
    this.payment$.subscribe(res => {
      this.typePayment = res.paymentType
    });
    this.methodPayment.emit(0);
  }

  getMethodPayment(value: number) {
    this.methodPayment.emit(value)
  }

  getCep() {
    const { postalCode } = this.formBillet.value;

    fetch(`https://viacep.com.br/ws/${postalCode}/json`, {
      method: "GET",
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(res => {
        const { localidade, bairro, logradouro, uf } = res;
        this.formBillet.controls["city"].setValue(localidade)
        this.formBillet.controls["neighborhood"].setValue(bairro)
        this.formBillet.controls["address"].setValue(logradouro)
        this.formBillet.controls["state"].setValue(uf)
      })
  }

}
