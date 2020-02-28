import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SubscriptionListComponent } from './subscription-list/subscription-list.component';
import { SubscriptionComponent } from './subscription/subscription.component';

const router: Routes = [
  { path: '', component: SubscriptionListComponent },
  { path: ':id', component: SubscriptionComponent },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(router)
  ]
})
export class RouterSubscriptionModule { }
