import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { MatGridListModule } from '@angular/material';
import { CoreModule } from '../../core/core.module';

import { ModuleGuard } from '../../shared/guards/module.guard';
import { FeatureGuard } from '../../shared/guards/feature.guard';

import { PaymentRoutingModule } from './payment-routing.module';
import { BudgetDataComponent } from './components/budget/budget-data/budget-data.component';
import { PaymentService } from './payment.service';
import { BudgetDataValuesComponent } from './components/budget/budget-data-values/budget-data-values.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    MatGridListModule,
    PaymentRoutingModule
  ],
  providers: [
    ModuleGuard,
    FeatureGuard,
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    PaymentService
  ],
  declarations: [
    BudgetDataComponent,
    BudgetDataValuesComponent
  ]/*,
  entryComponents: [
    PendencyComponent,
    VacancyComponent,
    ProcessDataDownloadComponent
  ]*/
})
export class PaymentModule { }
