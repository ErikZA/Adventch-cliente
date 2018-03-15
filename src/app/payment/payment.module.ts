import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetsComponent } from './budgets/budgets.component';

import { PaymentRoutingModule } from './payment-routing.module';
import { BudgetsDataComponent } from './budgets-data/budgets-data.component';

@NgModule({
  imports: [
    CommonModule,
    PaymentRoutingModule
  ],
  declarations: [BudgetsComponent, BudgetsDataComponent]
})
export class PaymentModule { }
