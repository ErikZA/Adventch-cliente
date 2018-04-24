import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '../shared/layout/layout.component';

import { AuthGuard } from '../shared/auth.guard';

import { TreasurersComponent } from './treasurers/treasurers.component';
import { TreasurersDataComponent } from './treasurers/components/treasurers-data/treasurers-data.component';
import { TreasurersFormComponent } from './treasurers/components/treasurers-form/treasurers-form.component';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';
import { EmptyPageComponent } from '../shared/empty-page/empty-page.component';

const routes: Routes = [
  { path: 'treasury', component: LayoutComponent, canActivate: [AuthGuard], canLoad: [AuthGuard], children: [
    { path: 'treasurers', component: TreasurersComponent, children: [
      { path: 'new', component: TreasurersFormComponent },
      { path: ':idTreasurer/edit', component: TreasurersFormComponent }
    ]}
  ]}
  /*{ path: 'treasury', canActivate: [AuthGuard], canLoad: [AuthGuard], children: [
    { path: '', component: LayoutComponent, children: [
      { path: '', component: DashboardComponent },
    ]},
    { path: 'treasurers', children: [
      { path: '', component: LayoutComponent, children:[
        { path: '', component: TreasurersComponent },
        { path: '', component: TreasurersFormComponent, outlet: 'sidenav' }
      ]},
      { path:':idTreasurer', children:[
        { path:'edit', component: LayoutComponent, children:[
          { path: '', component: TreasurersComponent },
          { path: '', component: TreasurersFormComponent, outlet: 'sidenav' }
        ]}
      ]}
    ]}
  ]}*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreasuryRoutingModule { }
