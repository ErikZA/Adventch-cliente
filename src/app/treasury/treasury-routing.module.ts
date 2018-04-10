import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '../shared/layout/layout.component';

import { AuthGuard } from '../shared/auth.guard';

import { TreasurersDataComponent } from './treasurers-data/treasurers-data.component';
import { TreasurersComponent } from './treasurers/treasurers.component';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';
import { EmptyPageComponent } from '../shared/empty-page/empty-page.component';

const routes: Routes = [
  { path: 'treasury', component: LayoutComponent, canActivate: [AuthGuard], canLoad: [AuthGuard], children: [
    { path: '', component: DashboardComponent },
    {
      path: 'treasurers', component: TreasurersComponent, children: [
        { path: 'novo', component: TreasurersDataComponent },
        { path: ':id/:name', component: TreasurersDataComponent }
      ]
    }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreasuryRoutingModule { }
