import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SubscriptionListComponent } from './subscription-list/subscription-list.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SubscriptionService } from './subscription.service';
import { RouterSubscriptionModule } from './router-subscription.module';
import { PaymentComponent } from './subscription/payment/payment.component';
import { IdentificationComponent } from './subscription/identification/identification.component';

@NgModule({
  declarations: [
    SubscriptionListComponent,
    SubscriptionComponent,
    PaymentComponent,
    IdentificationComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    RouterSubscriptionModule
  ],
  providers: [
    SubscriptionService
  ]
})
export class SubscriptionModule { }
