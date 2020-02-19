import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import CouponModel, { CouponReducer } from '../Coupon.model';
import { Read, Add, Remove } from '../../../../actions/coupon.action';

@Component({
  selector: 'app-coupons-form',
  templateUrl: './coupons-form.component.html',
  styleUrls: ['./coupons-form.component.scss']
})
export class CouponsFormComponent implements OnInit {

  @Input('formCoupon') formCoupon: FormGroup;

  public coupons: CouponModel[] = [];
  public coupon$: Observable<CouponReducer>;

  constructor(
    private store: Store<any>,
  ) {
    this.coupon$ = store.select('coupon');
    this.store.dispatch(Read());
  }

  ngOnInit() {
    this.coupon$.subscribe((res: any) => this.coupons = res);
  }

  addCoupon() {
    Add(
      this.formCoupon.controls["name"].value,
      this.formCoupon.controls["percentage"].value,
      this.formCoupon.controls["usageLimit"].value
    )
    this.formCoupon.reset();
  }

  removeCoupon(index) {
    Remove(index);
  }

}
