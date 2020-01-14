import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationsRoutingModule } from './registrations-routing.module';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { RegistrationComponent } from './registration/registration.component';
import { RegistrationDetailsComponent } from './registration-details/registration-details.component';
import { SharedModule } from '../shared/shared.module';
import {
  RegistrationInformationFormComponent
} from './registration-form/registration-information-form/registration-information-form.component';
import { RegistrationPaymentFormComponent } from './registration-form/registration-payment-form/registration-payment-form.component';
import { RegistrationPaymentCardComponent } from './registration-form/registration-payment-card/registration-payment-card.component';

import { MomentModule } from 'ngx-moment';

@NgModule({
  declarations: [
    RegistrationFormComponent,
    RegistrationComponent,
    RegistrationDetailsComponent,
    RegistrationInformationFormComponent,
    RegistrationPaymentFormComponent,
    RegistrationPaymentCardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MomentModule,
    RegistrationsRoutingModule
  ]
})
export class RegistrationsModule { }
