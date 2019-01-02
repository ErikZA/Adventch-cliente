import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../core/core.module';
import { MatGridListModule } from '@angular/material';

import { ModuleGuard } from '../../shared/guards/module.guard';
import { FeatureGuard } from '../../shared/guards/feature.guard';

import { PaymentRoutingModule } from './payment-routing.module';
import { BudgetDataComponent } from './components/budget/budget-data/budget-data.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    MatGridListModule,
    PaymentRoutingModule
  ],
  providers: [
    ModuleGuard,
    FeatureGuard
  ],
  declarations: [
    BudgetDataComponent
  ]/*,
  entryComponents: [
    PendencyComponent,
    VacancyComponent,
    ProcessDataDownloadComponent
  ]*/
})
export class PaymentModule { }
