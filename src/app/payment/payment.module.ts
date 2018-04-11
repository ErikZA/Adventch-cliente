import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetsComponent } from './budgets/budgets.component';

import { PaymentRoutingModule } from './payment-routing.module';
import { BudgetsDataComponent } from './budgets/components/budgets-data/budgets-data.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    PaymentRoutingModule
  ],
  declarations: [BudgetsComponent, BudgetsDataComponent]
})
export class PaymentModule { }
