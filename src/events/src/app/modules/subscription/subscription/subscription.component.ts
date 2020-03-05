import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatSnackBar, MatCheckbox } from '@angular/material';

import { SubscriptionService } from '../subscription.service';
import { Subscription } from 'src/app/actions/subscription.action';
import { loaded } from 'src/app/actions/loading.action';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  public formIdentity: FormGroup;
  public formBillet: FormGroup;
  public formCoupon: FormGroup;
  public formcreditCard: FormGroup;

  public nameEvent: string;
  public products = [];
  public event: any;
  public isFormValid = false;

  public total: number;
  public productsSelect: string[] = [];
  public couponId: string = "";
  public discount = 0;
  public fieldResponses: any[] = [];
  public paymentType: number;
  public isLoaded = false;
  public aliasName: string;

  constructor(
    public router: ActivatedRoute,
    private _subscription: SubscriptionService,
    private store: Store<any>,
    private fb: FormBuilder,
    private snackbar: MatSnackBar
  ) {
    store.dispatch(loaded(false));
  }

  ngOnInit() {

    this.formIdentity = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      fieldResponses: this.fb.array([]),
    })

    this.formCoupon = this.fb.group({
      name: ['', Validators.required]
    })

    this.formBillet = this.fb.group({
      address: ['', Validators.required],
      number: ['', Validators.required],
      neighborhood: ['', Validators.required],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
    })

    this.formcreditCard = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      holder: ['', Validators.required],
      expirationDate: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      securityCode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      installments: ['', Validators.required]
    })

    const fields = this.formIdentity.controls.fieldResponses as FormArray

    this.router.params.subscribe((res: any) => {
      this.nameEvent = res.id
      this._subscription.OneEvent(res.id).then((res: any) => {
        const { event, aliasName } = res.data[0]
        this.aliasName = aliasName;

        for (let f of event.fields) {
          const { id, name, isRequired, fieldTypeId } = f;
          fields.push(this.fb.group({
            [`${name}`]: ["", isRequired ? Validators.required : null]
          }))
        }

        this.total = event.cashValue;
        this.store.dispatch(Subscription(event))
        this.event = event
        this.products = event.products;
      }).finally(() => this.store.dispatch(loaded(true)))
    });
  }

  fields(event: any) {
    this.fieldResponses = event;
  }

  getTypePayment(event) {
    this.paymentType = event;
  }

  private formatExpirationDate(date): string {
    if (date) {
      date = [date.slice(0, 2), '20', date.slice(2)].join('');
      return date.replace(/(\d{2})(\d{4})/, '$1/$2');
    }
    return null;
  }

  addProduct(id: string, value: number, index: number, event: MatCheckbox) {
    if (event.checked) {
      this.productsSelect.push(id)
      this.total += value;
    } else {
      this.total -= value;
      this.productsSelect.splice(index, 1);
    }
  }

  sendCoupon() {
    const { name } = this.formCoupon.value;
    this._subscription.Coupon(name, this.event.id).subscribe((res: any) => {
      if (res.totalRows <= 0) {
        this.snackbar.open("Cupom invalido", "Fechar", { duration: 2000 })
      } else {
        const { couponId, percentage } = res.data[0];
        this.couponId = couponId
        this.discount = (percentage * this.event.cashValue) / 100;
        this.total -= (percentage * this.event.cashValue) / 100;
      }
    })
  }

  pay() {
    const { name, email, cpf } = this.formIdentity.value;
    const { cardNumber, holder, expirationDate, securityCode, installments } = this.formcreditCard.value;
    const pay = {
      ...this.formIdentity.value,
      fieldResponses: this.fieldResponses,
      billetData: {
        payer: {
          name: name,
          cpfCnpj: cpf,
          email: email,
          ...this.formBillet.value,
        },
        daysToExpire: 5,
        amount: this.total,
        paymentLocation: "Pagável em qualquer banco até o vencimento",
        billetMessages: ["Oi sou um texto1", "Oi sou um texto2", "Oi sou um texto3"]
      },
      cardData: {
        amount: this.total,
        merchantOrderId: "",
        customerName: "",
        installments: installments,
        creditCardData: {
          cardNumber: cardNumber,
          holder: holder,
          expirationDate: this.formatExpirationDate(expirationDate),
          securityCode: securityCode,
          brand: 2,
        }
      },
      amount: this.total,
      eventId: this.event.id,
      paymentType: this.paymentType,
      couponId: this.couponId === "" ? null : this.couponId,
      products: this.productsSelect,
    }
    this._subscription.Subscription(this.aliasName, pay);
  }

}
