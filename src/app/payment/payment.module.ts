import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetsComponent } from './budgets/budgets.component';

import { PaymentRoutingModule } from './payment-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PaymentRoutingModule
  ],
  declarations: [BudgetsComponent]
})
export class PaymentModule { }
