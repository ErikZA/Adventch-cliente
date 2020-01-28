import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { SubscriptionsRoutingModule } from './subscriptions-routing.module';
import { SubscriptionComponent } from './subscription/subscription.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { InformationFormComponent } from './subscription/information-form/information-form.component';
import { PaymentsFormComponent } from './subscription/payments-form/payments-form.component';
import { ProductsFormComponent } from './subscription/products-form/products-form.component';
import { CouponsFormComponent } from './subscription/coupons-form/coupons-form.component';
import { AdressFormComponent } from './subscription/adress-form/adress-form.component';

import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';

export const MY_MOMENT_FORMATS = {
  parseInput: '2 LT',
  fullPickerInput: '2 LT',
  datePickerInput: '2',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

@NgModule({
  declarations: [
    SubscriptionComponent,
    InformationFormComponent,
    PaymentsFormComponent,
    ProductsFormComponent,
    CouponsFormComponent,
    AdressFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SubscriptionsRoutingModule,
    HttpClientModule,

    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  providers: [
    { provide: OWL_DATE_TIME_LOCALE, useValue: MY_MOMENT_FORMATS },
  ]
})
export class SubscriptionsModule { }
