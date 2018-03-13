import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '../shared/layout/layout.component';

import { AuthGuard } from '../shared/auth.guard';

import { BudgetsComponent } from './budgets/budgets.component';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';
import { EmptyPageComponent } from '../shared/empty-page/empty-page.component';
import { PageNotFoundComponent } from '../shared/page-not-found/page-not-found.component';

const routes: Routes = [
   { path: 'payment', component: LayoutComponent, canActivate: [AuthGuard], canLoad: [AuthGuard], children: [
      { path: '', component: DashboardComponent },
      {
        path: 'budgets', component: BudgetsComponent, children: [
          // { path: 'novo', component: BonificationTypesDataComponent },
          // { path: ':id/:name', component: BonificationTypesDataComponent }
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
