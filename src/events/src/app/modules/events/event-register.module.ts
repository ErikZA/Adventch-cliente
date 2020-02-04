import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Modules
import { SharedModule } from '../../shared/shared.module';
import { EventRegisterRoutingModule } from './event-register-routing.module';

// Components
import { EventRegisterComponent } from './event-register/event-register.component';
import { InformationFormComponent } from './event-register/information-form/information-form.component';
import { PaymentsFormComponent } from './event-register/payments-form/payments-form.component';
import { ProductsFormComponent } from './event-register/products-form/products-form.component';
import { CouponsFormComponent } from './event-register/coupons-form/coupons-form.component';
import { AdressFormComponent } from './event-register/adress-form/adress-form.component';

import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { EventRegisterService } from './event-register/event-register.service';

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
    EventRegisterComponent,
    InformationFormComponent,
    PaymentsFormComponent,
    ProductsFormComponent,
    CouponsFormComponent,
    AdressFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    EventRegisterRoutingModule,
    HttpClientModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  providers: [
    { provide: OWL_DATE_TIME_LOCALE, useValue: MY_MOMENT_FORMATS },
    EventRegisterService,
  ]
})
export class EventRegisterModule { }
