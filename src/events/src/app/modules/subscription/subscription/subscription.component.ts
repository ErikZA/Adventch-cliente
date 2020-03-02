import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';

import { SubscriptionService } from '../subscription.service';
import { Subscription } from 'src/app/actions/subscription.action';
import { MatSnackBar, MatCheckbox } from '@angular/material';


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

  constructor(
    public router: ActivatedRoute,
    private _subscription: SubscriptionService,
    private store: Store<any>,
    private fb: FormBuilder,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {

    this.formIdentity = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.minLength(11)]],
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
      cardNumber: ['', Validators.required],
      holder: ['', Validators.required],
      expirationDate: ['', Validators.required],
      securityCode: ['', Validators.required],
    })

    const fields = this.formIdentity.controls.fieldResponses as FormArray

    this.router.params.subscribe((res: any) => {
      this.nameEvent = res.id
      this._subscription.OneEvent(res.id).subscribe((res: any) => {
        const { event } = res.data[0]

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
      })
    });
  }

  fields(event: any) {
    this.fieldResponses = event;
  }

  getTypePayment(event) {
    this.paymentType = event;
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
    this._subscription.Coupon(name).subscribe((res: any) => {
      if (res.totalRows <= 0) {
        this.snackbar.open("Coupom invalido", "Fechar", { duration: 2000 })
      } else {
        const { couponId, percentage } = res.data[0];
        this.couponId = couponId
        this.discount = (percentage * this.event.cashValue) / 100;
        this.total -= (percentage * this.event.cashValue) / 100;
      }
    })
  }

  pay() {
    const pay = {
      ...this.formIdentity.value,
      fieldResponses: this.fieldResponses,
      billetData: {
        payer: {
          ...this.formBillet.value
        },
        daysToExpire: 5,
        amount: this.total,
        paymentLocation: "Pagável em qualquer banco até o vencimento",
        billetMessages: ["Aqui vai uma mensagem"]
      },
      cardData: {
        amount: this.total,
        merchantOrderId: "",
        customerName: "",
        installments: 0,
        creditCardData: {
          ...this.formcreditCard.value,
          brand: 1,
        }
      },
      amount: this.total,
      eventId: this.event.id,
      paymentType: this.paymentType,
      couponId: this.couponId,
      products: this.productsSelect,
    }
    console.log(JSON.stringify(pay))
    this._subscription.Subscription(pay);
  }

}
