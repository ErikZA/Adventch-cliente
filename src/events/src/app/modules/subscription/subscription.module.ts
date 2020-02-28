import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SubscriptionListComponent } from './subscription-list/subscription-list.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SubscriptionService } from './subscription.service';
import { RouterSubscriptionModule } from './router-subscription.module';

@NgModule({
  declarations: [
    SubscriptionListComponent,
    SubscriptionComponent
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
