import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '../../shared/layout/layout.component';

import { AuthGuard } from '../../shared/auth.guard';

import { TreasurerComponent } from './components/treasurer/treasurer.component';
import { TreasurerDataComponent } from './components/treasurer/treasurer-data/treasurer-data.component';
import { TreasurerFormComponent } from './components/treasurer/treasurer-form/treasurer-form.component';
import { DashboardComponent } from '../../shared/dashboard/dashboard.component';
import { EmptyPageComponent } from '../../shared/empty-page/empty-page.component';

const routes: Routes = [
  { path: 'tesouraria', component: LayoutComponent, canActivate: [AuthGuard], canLoad: [AuthGuard], children: [
    { path: 'tesoureiros', component: TreasurerComponent, children: [
      { path: 'novo', component: TreasurerFormComponent },
      { path: ':idTreasurer/editar', component: TreasurerFormComponent }
    ]}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreasuryRoutingModule { }
