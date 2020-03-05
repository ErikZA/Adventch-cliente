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
  public cardFlag: string;

  public parcelamento: any[] = [];
  constructor(
    private store: Store<any>,
  ) {
    this.payment$ = store.select('subscription')
  }

  ngOnInit() {
    this.payment$.subscribe(res => {
      this.typePayment = res.paymentType

      for (let i = 1; i <= res.installmentLimit; i++) {
        if (i === 1) {
          this.parcelamento.push({ value: res.cashValue });
        } else if (i > 1) {
          this.parcelamento.push({ value: (res.installmentAmount / i).toFixed(2) })
        }
      }

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

  selectCardBrand(e) {
    e = e.replace(/\s+/g, '');

    if (e.length == 16) {
      this.cardFlag = this.getCardFlag(e);
    } else {
      this.cardFlag = '';
    }

  }

  private getCardFlag(cardnumber) {
    var cards = {
      elo: /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})/,
      hipercard: /^(606282\d{10}(\d{3})?)|(3841\d{15})/,
      master: /^5[1-5][0-9]{14}/,
      visa: /^4[0-9]{12}(?:[0-9]{3})/
    };

    for (var flag in cards) {
      if (cards[flag].test(cardnumber)) {
        return flag;
      }
    }

    return '';
  }

}
