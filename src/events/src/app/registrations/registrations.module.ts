import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationsRoutingModule } from './registrations-routing.module';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { RegistrationComponent } from './registration/registration.component';
import { RegistrationDetailsComponent } from './registration-details/registration-details.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    RegistrationFormComponent,
    RegistrationComponent,
    RegistrationDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RegistrationsRoutingModule
  ]
})
export class RegistrationsModule { }
