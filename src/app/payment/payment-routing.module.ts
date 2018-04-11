import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '../shared/layout/layout.component';

import { AuthGuard } from '../shared/auth.guard';

import { BudgetsDataComponent } from './budgets/components/budgets-data/budgets-data.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';
import { EmptyPageComponent } from '../shared/empty-page/empty-page.component';

const routes: Routes = [
   { path: 'payment', component: LayoutComponent, canActivate: [AuthGuard], canLoad: [AuthGuard], children: [
      { path: '', component: DashboardComponent },
      {
        path: 'budgets', component: BudgetsComponent, children: [
           { path: 'novo', component: BudgetsDataComponent },
           { path: ':id/:name', component: BudgetsDataComponent }
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
